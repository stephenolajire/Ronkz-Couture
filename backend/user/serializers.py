from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
import re

User = get_user_model()

# Enhanced email regex
email_regex = r'^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class UserRegistrationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate_password(self, value):
        # Use Django's built-in password validators first
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        
        # Custom password requirements
        errors = []
        
        if len(value) < 8:
            errors.append("Password must be at least 8 characters long.")
        
        if not any(char.isdigit() for char in value):
            errors.append("Password must contain at least one digit.")
        
        if not any(char.islower() for char in value):
            errors.append("Password must contain at least one lowercase letter.")
        
        if not any(char.isupper() for char in value):
            errors.append("Password must contain at least one uppercase letter.")
        
        # Expanded special characters
        special_chars = "!@#$%^&*()-_+=[]{}|;:,.<>?/~`"
        if not any(char in special_chars for char in value):
            errors.append("Password must contain at least one special character (!@#$%^&*()-_+=[]{}|;:,.<>?/~`).")
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return value

    def validate_email(self, value):
        # Normalize email to lowercase
        value = value.lower().strip()
        
        # Check if email already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        # Validate email format
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters long.")
        
        return value.strip().title()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters long.")
        
        return value.strip().title()


    @transaction.atomic
    def create(self, validated_data):
        """
        Create user with proper password hashing and error handling
        """
        try:
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
            )
            return user
        except Exception as e:
            raise serializers.ValidationError({
                'non_field_errors': ['An error occurred while creating the user. Please try again.']
            })