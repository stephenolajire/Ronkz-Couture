from rest_framework import serializers
from .models import *
from rest_framework import serializers
from django.contrib.auth import get_user_model
import re

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'slug', 'image_url', 'measurements', 'category']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None



class CustomOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomOrder
        fields = '__all__'


class CustomOrderSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomOrder
        fields = ["first_name", "last_name", "email", "whatsapp", "styleDescription", 
                 "occasion", "budget", "timeline", "neck", "arms", "shoulders", "chest", 
                 "waist", "hips", "inseam", "height", "image", "picture"]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if not re.match(r'^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_whatsapp(self, value):
        if not value:
            raise serializers.ValidationError("WhatsApp number is required.")
        if not re.match(r'^\+?[0-9]\d{1,14}$', value):
            raise serializers.ValidationError("Invalid WhatsApp number format.")
        return value

    def validate_first_name(self, value):
        if not value:
            raise serializers.ValidationError("Firstname cannot be empty")
        if len(value) < 3:  # Fixed syntax error: was len(value < 3)
            raise serializers.ValidationError("Firstname must be more than 3 characters")
        return value

    def validate_last_name(self, value):
        if not value:
            raise serializers.ValidationError("Lastname cannot be empty")
        if len(value) < 2:
            raise serializers.ValidationError("Lastname must be at least 2 characters")
        return value

    def validate_styleDescription(self, value):
        if not value:
            raise serializers.ValidationError("Style description is required")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Style description must be at least 10 characters")
        return value.strip()

    def validate_occasion(self, value):
        if not value:
            raise serializers.ValidationError("Occasion is required")
        return value

    def validate_budget(self, value):
        if value is None:
            raise serializers.ValidationError("Budget is required")
        return value

    def validate_timeline(self, value):
        if not value:
            raise serializers.ValidationError("Timeline is required")
        return value

    def validate_height(self, value):
        if value is None:
            raise serializers.ValidationError("Height is required")
        if value <= 0:
            raise serializers.ValidationError("Height must be greater than 0")
        return value

    def validate_chest(self, value):
        if value is None:
            raise serializers.ValidationError("Chest measurement is required")
        if value <= 0:
            raise serializers.ValidationError("Chest measurement must be greater than 0")
        return value

    def validate_waist(self, value):
        if value is None:
            raise serializers.ValidationError("Waist measurement is required")
        if value <= 0:
            raise serializers.ValidationError("Waist measurement must be greater than 0")
        return value

    def validate_hips(self, value):
        if value is None:
            raise serializers.ValidationError("Hip measurement is required")
        if value <= 0:
            raise serializers.ValidationError("Hip measurement must be greater than 0")
        return value

    # Optional measurements validation (can be None but if provided must be positive)
    def validate_neck(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Neck measurement must be greater than 0")
        return value

    def validate_arms(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Arms measurement must be greater than 0")
        return value

    def validate_shoulders(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Shoulders measurement must be greater than 0")
        return value

    def validate_inseam(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Inseam measurement must be greater than 0")
        return value

    def validate(self, attrs):
        # Example: Check if at least one image is provided
        if not attrs.get('image') and not attrs.get('picture'):
            raise serializers.ValidationError(
                "At least one image (image or picture) must be provided"
            )
        
        return attrs
    
    def create(self, validated_data):
        custom_order = CustomOrder.objects.create(**validated_data)
        return custom_order
    
