from rest_framework import serializers
from .models import *
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomOrder, CustomerMeasurement, CustomOrderNote
from datetime import date

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



class CustomerMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerMeasurement
        fields = [
            'bust_chest', 'waist', 'hips', 'height',
            'inseam', 'neck', 'arms', 'shoulders'
        ]
    
    def validate(self, data):
        """
        Validate measurement data for consistency
        """
        # Check if waist is smaller than hips (generally true)
        if data.get('waist') and data.get('hips'):
            if data['waist'] > data['hips'] * 1.2:  # Allow some flexibility
                raise serializers.ValidationError(
                    "Waist measurement seems unusually large compared to hips. Please verify."
                )
        
        # Check if neck is reasonable compared to other measurements
        if data.get('neck') and data.get('bust_chest'):
            if data['neck'] > data['bust_chest'] * 0.8:
                raise serializers.ValidationError(
                    "Neck measurement seems unusually large. Please verify."
                )
        
        return data


class CustomOrderNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = CustomOrderNote
        fields = ['id', 'note', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['created_by', 'created_at']


class CustomOrderSerializer(serializers.ModelSerializer):
    measurements = CustomerMeasurementSerializer(required=True)
    notes = CustomOrderNoteSerializer(many=True, read_only=True)
    full_name = serializers.CharField(read_only=True)
    
    # Custom fields for better frontend handling
    style_image_url = serializers.SerializerMethodField()
    personal_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomOrder
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 
            'whatsapp_number', 'style_description', 'occasion', 
            'budget', 'timeline', 'style_image', 'personal_image',
            'style_image_url', 'personal_image_url',
            'status', 'measurements', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def get_style_image_url(self, obj):
        if obj.style_image:
            return obj.style_image.url
        return None
    
    def get_personal_image_url(self, obj):
        if obj.personal_image:
            return obj.personal_image.url
        return None
    
    def validate_email(self, value):
        """
        Validate email format and check for basic patterns
        """
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        # Basic email validation (Django's EmailField handles most cases)
        if '@' not in value or '.' not in value.split('@')[-1]:
            raise serializers.ValidationError("Please enter a valid email address.")
        
        return value.lower()
    
    def validate_whatsapp_number(self, value):
        """
        Validate WhatsApp number format
        """
        if not value:
            raise serializers.ValidationError("WhatsApp number is required.")
        
        # Remove all non-digit characters for validation
        digits_only = ''.join(filter(str.isdigit, value))
        
        # Nigerian numbers should have 11 digits (without country code) or 13-14 with country code
        if len(digits_only) not in [10, 11, 13, 14]:
            raise serializers.ValidationError(
                "Please enter a valid WhatsApp number (10-14 digits)."
            )
        
        return value
    
    def validate_timeline(self, value):
        """
        Validate that timeline is not in the past and reasonable
        """
        if not value:
            raise serializers.ValidationError("Timeline is required.")
        
        if value < date.today():
            raise serializers.ValidationError("Timeline cannot be in the past.")
        
        # Check if timeline is too far in the future (e.g., more than 1 year)
        from datetime import timedelta
        max_future_date = date.today() + timedelta(days=365)
        if value > max_future_date:
            raise serializers.ValidationError(
                "Timeline cannot be more than 1 year from today."
            )
        
        return value
    
    def validate_style_description(self, value):
        """
        Validate style description
        """
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Style description must be at least 10 characters long."
            )
        
        if len(value) > 1000:
            raise serializers.ValidationError(
                "Style description cannot exceed 1000 characters."
            )
        
        return value.strip()
    
    def validate(self, data):
        """
        Cross-field validation
        """
        # Ensure first and last names are provided
        if not data.get('first_name') or not data.get('first_name').strip():
            raise serializers.ValidationError({
                'first_name': 'First name is required.'
            })
        
        if not data.get('last_name') or not data.get('last_name').strip():
            raise serializers.ValidationError({
                'last_name': 'Last name is required.'
            })
        
        # Validate required fields
        required_fields = ['occasion', 'budget']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({
                    field: f'{field.title()} is required.'
                })
        
        return data
    
    def create(self, validated_data):
        """
        Create custom order with measurements
        """
        measurements_data = validated_data.pop('measurements')
        
        # Associate with user if available in context
        user = self.context.get('user')
        if user and user.is_authenticated:
            validated_data['user'] = user
        
        # Create the custom order
        custom_order = CustomOrder.objects.create(**validated_data)
        
        # Create measurements
        CustomerMeasurement.objects.create(
            custom_order=custom_order, 
            **measurements_data
        )
        
        return custom_order
    
    def update(self, instance, validated_data):
        """
        Update custom order and measurements
        """
        measurements_data = validated_data.pop('measurements', None)
        
        # Update custom order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update measurements if provided
        if measurements_data:
            measurement_instance = getattr(instance, 'measurements', None)
            if measurement_instance:
                for attr, value in measurements_data.items():
                    setattr(measurement_instance, attr, value)
                measurement_instance.save()
            else:
                CustomerMeasurement.objects.create(
                    custom_order=instance, 
                    **measurements_data
                )
        
        return instance


class CustomOrderListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing custom orders
    """
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = CustomOrder
        fields = [
            'id', 'full_name', 'email', 'occasion', 
            'budget', 'timeline', 'status', 'created_at'
        ]


class CustomOrderStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating only the status of a custom order
    """
    class Meta:
        model = CustomOrder
        fields = ['status']
    
    def validate_status(self, value):
        """
        Validate status transitions
        """
        if self.instance:
            current_status = self.instance.status
            
            # Define allowed status transitions
            allowed_transitions = {
                'pending': ['in_progress', 'cancelled'],
                'in_progress': ['completed', 'cancelled'],
                'completed': [],  # No transitions from completed
                'cancelled': []   # No transitions from cancelled
            }
            
            if value not in allowed_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Cannot change status from '{current_status}' to '{value}'"
                )
        
        return value