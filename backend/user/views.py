from django.shortcuts import render
from .serializers import *
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
import string
import logging
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

User = get_user_model()
logger = logging.getLogger(__name__)

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def generate_otp(self):
        """Generate a 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
    
    def send_verification_email(self, user):
        """
        Send OTP verification email to the user
        Returns tuple (success: bool, error_message: str)
        """
        try:
            # Generate OTP
            otp = self.generate_otp()
            
            # Store OTP in user model
            user.email_otp = otp
            user.email_otp_created_at = timezone.now()
            user.email_otp_expires_at = timezone.now() + timedelta(minutes=10)  # OTP expires in 10 minutes
            user.save()
            
            # Prepare email content
            context = {
                'user': user,
                'otp': otp,
                'expiry_minutes': 10,
                'company_name': getattr(settings, 'COMPANY_NAME', 'Ronks Couture'),
                'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@ronkscouture.com'),
            }
            
            # Render email template
            html_message = render_to_string('emails/email_otp.html', context)
            plain_message = strip_tags(html_message)
            
            # Send email
            send_mail(
                subject='Welcome! Verify Your Email Address',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"OTP verification email sent successfully to {user.email}")
            return True, None
            
        except Exception as e:
            logger.error(f"Failed to send OTP email to {user.email}: {str(e)}")
            return False, str(e)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send verification email automatically
        email_sent, email_error = self.send_verification_email(user)
        
        # Prepare response
        response_data = {
            "user": UserSerializer(user).data,
            "message": "Account created successfully!"
        }
        
        if email_sent:
            response_data.update({
                "verification_email_sent": True,
                "verification_message": "A verification code has been sent to your email address.",
                "otp_expires_in_minutes": 10
            })
        else:
            response_data.update({
                "verification_email_sent": False,
                "verification_error": "Account created but failed to send verification email. You can request a new verification code.",
                "email_error_details": email_error if settings.DEBUG else None  # Only show details in debug mode
            })
            # Log the error but don't fail the registration
            logger.warning(f"User {user.email} registered successfully but email sending failed: {email_error}")
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    

class VerifyEmailOTPView(APIView):
    """
    Verify the OTP sent to user's email
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if email is already verified
        if getattr(user, 'is_email_verified', False):
            return Response(
                {"message": "Email is already verified"}, 
                status=status.HTTP_200_OK
            )
        
        # Check if OTP is valid
        if not hasattr(user, 'email_otp') or not user.email_otp:
            return Response(
                {"error": "No OTP found for this email. Please request a new verification code."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP matches
        if user.email_otp != otp:
            return Response(
                {"error": "Invalid OTP. Please check your email and try again."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP has expired
        if timezone.now() > user.email_otp_expires_at:
            return Response(
                {"error": "OTP has expired. Please request a new verification code."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark email as verified
        user.is_email_verified = True
        user.email_otp = None
        user.email_otp_created_at = None
        user.email_otp_expires_at = None
        user.save()
        
        logger.info(f"Email verified successfully for user: {user.email}")
        
        return Response(
            {
                "message": "Email verified successfully! Your account is now active.",
                "user": UserSerializer(user).data,
                "is_email_verified": True
            }, 
            status=status.HTTP_200_OK
        )


class ResendEmailOTPView(APIView):
    """
    Resend OTP to user's email
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {"error": "Email is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if email is already verified
        if getattr(user, 'is_email_verified', False):
            return Response(
                {"message": "Email is already verified"}, 
                status=status.HTTP_200_OK
            )
        
        # Check if enough time has passed since last OTP (prevent spam)
        if (hasattr(user, 'email_otp_created_at') and user.email_otp_created_at and 
            timezone.now() < user.email_otp_created_at + timedelta(minutes=1)):
            remaining_seconds = int((user.email_otp_created_at + timedelta(minutes=1) - timezone.now()).total_seconds())
            return Response(
                {
                    "error": f"Please wait {remaining_seconds} seconds before requesting a new OTP",
                    "retry_after_seconds": remaining_seconds
                }, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        # Use the same logic as SendEmailOTPView
        send_otp_view = SendEmailOTPView()
        return send_otp_view.post(request, *args, **kwargs)
    

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            password = request.data.get('password', '')
            
            # Validate input
            if not email or not password:
                return Response({
                    'error': 'Both email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate email format
            try:
                validate_email(email)
            except ValidationError:
                return Response({
                    'error': 'Please enter a valid email address'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Try to get user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if user account is active
            if not user.is_active:
                return Response({
                    'error': 'Your account has been deactivated. Please contact support.'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Verify password
            if not user.check_password(password):
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Authenticate user
            authenticated_user = authenticate(request, username=email, password=password)
            
            if authenticated_user is not None:
                # Generate tokens
                tokens = self.get_tokens_for_user(authenticated_user)
                
                # Return success response
                return Response({
                    'message': 'Login successful',
                    'access': tokens['access'],
                    'refresh': tokens['refresh'],
                    'user': {
                        'id': str(authenticated_user.id),
                        'email': authenticated_user.email,
                        'first_name': authenticated_user.first_name,
                        'last_name': authenticated_user.last_name,
                        'is_staff': authenticated_user.is_staff,
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            return Response({
                'error': 'An unexpected error occurred. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_tokens_for_user(self, user):
        """Generate JWT tokens for the user"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class RefreshTokenAPIView(APIView):
    """
    Class-based view for token refresh
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle POST request for token refresh"""
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Create refresh token object
                refresh = RefreshToken(refresh_token)
                
                # Generate new access token
                access_token = str(refresh.access_token)
                
                return Response({
                    'access': access_token,
                    'message': 'Token refreshed successfully'
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({
                    'error': 'Invalid or expired refresh token'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            return Response({
                'error': 'An unexpected error occurred. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutAPIView(APIView):
    """
    Class-based view for user logout
    """
    def post(self, request):
        """Handle POST request for logout"""
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()
                
                return Response({
                    'message': 'Successfully logged out'
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({
                    'error': 'Invalid or already blacklisted token'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'error': 'An unexpected error occurred. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class SendEmailOTPView(APIView):
    """
    Send OTP to user's email for verification (for manual requests)
    """
    permission_classes = [permissions.AllowAny]
        
    def generate_otp(self):
        """Generate a 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
        
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
                
        if not email:
            return Response(
                {
                    "message": "Email is required",
                    "success": False,
                    "error": "Email is required"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
                
        try:
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {
                        "message": "User with this email does not exist",
                        "success": False,
                        "error": "User with this email does not exist"
                    }, 
                    status=status.HTTP_404_NOT_FOUND
                )
                        
            # Check if email is already verified (optional - remove if not needed)
            # if getattr(user, 'is_email_verified', False):
            #     return Response(
            #         {
            #             "message": "Email is already verified",
            #             "success": True
            #         }, 
            #         status=status.HTTP_200_OK
            #     )
            
            # Send OTP regardless of verification status (for forgot password)
            email_sent, email_error = self.send_verification_email(user)
            if not email_sent:
                return Response(
                    {
                        "message": "Failed to send verification email",
                        "success": False,
                        "error": f"Failed to send verification email: {email_error}"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response(
                {
                    "message": "Verification email sent successfully",
                    "success": True
                },
                status=status.HTTP_200_OK
            )
                        
        except Exception as e:
            logger.error(f"Unexpected error in SendEmailOTPView: {str(e)}")
            return Response(
                {
                    "message": "An unexpected error occurred",
                    "success": False,
                    "error": "An unexpected error occurred while sending OTP"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def send_verification_email(self, user):
        """
        Send OTP verification email to the user
        Returns tuple (success: bool, error_message: str)
        """
        try:
            # Generate OTP
            otp = self.generate_otp()
                        
            # Store OTP in user model
            user.email_otp = otp
            user.email_otp_created_at = timezone.now()
            user.email_otp_expires_at = timezone.now() + timedelta(minutes=10)  # OTP expires in 10 minutes
            user.save()
                        
            # Prepare email content
            context = {
                'user': user,
                'otp': otp,
                'expiry_minutes': 10,
                'company_name': getattr(settings, 'COMPANY_NAME', 'Ronks Couture'),
                'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@ronkscouture.com'),
            }
                        
            # Render email template
            html_message = render_to_string('emails/email_otp.html', context)
            plain_message = strip_tags(html_message)
                        
            # Send email
            send_mail(
                subject='Password Reset - Verify Your Email Address',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
                        
            logger.info(f"OTP verification email sent successfully to {user.email}")
            return True, None
                                
        except Exception as e:
            logger.error(f"Failed to send OTP email to {user.email}: {str(e)}")
            return False, str(e)


class VerifyPasswordOTPView(APIView):
    """
    Verify OTP sent to user's email
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response(
                {
                    "message": "Email and OTP are required",
                    "success": False,
                    "error": "Email and OTP are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "message": "User with this email does not exist",
                    "success": False,
                    "error": "User with this email does not exist"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if OTP exists and is valid
        if not hasattr(user, 'email_otp') or not user.email_otp:
            return Response(
                {
                    "message": "No OTP found. Please request a new one",
                    "success": False,
                    "error": "No OTP found. Please request a new one"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP has expired
        if hasattr(user, 'email_otp_expires_at') and user.email_otp_expires_at:
            if timezone.now() > user.email_otp_expires_at:
                return Response(
                    {
                        "message": "OTP has expired. Please request a new one",
                        "success": False,
                        "error": "OTP has expired. Please request a new one"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Verify OTP
        if user.email_otp != otp:
            return Response(
                {
                    "message": "Invalid OTP. Please try again",
                    "success": False,
                    "error": "Invalid OTP. Please try again"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # OTP is valid - generate a temporary token for password change
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Clear OTP fields
        user.email_otp = None
        user.email_otp_created_at = None
        user.email_otp_expires_at = None
        user.save()
        
        return Response(
            {
                "message": "OTP verified successfully",
                "success": True,
                "token": str(access_token)
            },
            status=status.HTTP_200_OK
        )

class ResetPasswordView(APIView):
    """
    Set a new password for the user
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        new_password = request.data.get("password")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not new_password:
            return Response(
                {"error": "New password is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )


class ChangePasswordView(APIView):
    """
    Change password for the user
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {"error": "Old password and new password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )