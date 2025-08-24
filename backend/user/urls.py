from django.urls import path
from .views import *

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify-email'),
    path('resend-otp/', ResendEmailOTPView.as_view(), name='resend-otp'),
    path('send-otp/', SendEmailOTPView.as_view(), name='send-otp'),
    path('login/', LoginAPIView.as_view(), name='user-login'),
]