from django.db import models
from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    slug = models.SlugField(unique=True)
    measurements = models.TextField()

    def __str__(self):
        return self.name


class CustomOrder(models.Model):
    OCCASION_CHOICES = [
        ('birthday', 'Birthday'),
        ('burial', 'Burial'),
        ('graduation', 'Graduation'),
        ('office', 'Office'),
        ('wedding', 'Wedding'),
    ]
    
    BUDGET_CHOICES = [
        ('15000-25000', '₦15,000 - ₦25,000'),
        ('25000-30000', '₦25,000 - ₦30,000'),
        ('30000-40000', '₦30,000 - ₦40,000'),
        ('40000-50000', '₦40,000 - ₦50,000'),
        ('50000+', '₦50,000 +'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Contact Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    whatsapp_number = models.CharField(max_length=20)
    
    # Design Information
    style_description = models.TextField()
    occasion = models.CharField(max_length=20, choices=OCCASION_CHOICES)
    budget = models.CharField(max_length=20, choices=BUDGET_CHOICES)
    timeline = models.DateField()
    
    # Images
    style_image = models.ImageField(upload_to='custom_orders/styles/', null=True, blank=True)
    personal_image = models.ImageField(upload_to='custom_orders/personal/', null=True, blank=True)
    
    # Status and Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Optional user association (if user is logged in)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Custom Order'
        verbose_name_plural = 'Custom Orders'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.occasion} ({self.status})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class CustomerMeasurement(models.Model):
    custom_order = models.OneToOneField(
        CustomOrder, 
        on_delete=models.CASCADE, 
        related_name='measurements'
    )
    
    # Body measurements (in inches)
    bust_chest = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        validators=[MinValueValidator(10), MaxValueValidator(100)],
        help_text="Bust/Chest measurement in inches"
    )
    waist = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(10), MaxValueValidator(100)],
        help_text="Waist measurement in inches"
    )
    hips = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(10), MaxValueValidator(100)],
        help_text="Hips measurement in inches"
    )
    height = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(36), MaxValueValidator(84)],
        help_text="Height in inches"
    )
    inseam = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(10), MaxValueValidator(50)],
        help_text="Inseam measurement in inches"
    )
    neck = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(8), MaxValueValidator(25)],
        help_text="Neck measurement in inches"
    )
    arms = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(10), MaxValueValidator(40)],
        help_text="Arm length in inches"
    )
    shoulders = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(10), MaxValueValidator(30)],
        help_text="Shoulder width in inches"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Customer Measurement'
        verbose_name_plural = 'Customer Measurements'
    
    def __str__(self):
        return f"Measurements for {self.custom_order.full_name}"


class CustomOrderNote(models.Model):
    custom_order = models.ForeignKey(
        CustomOrder, 
        on_delete=models.CASCADE, 
        related_name='notes'
    )
    note = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for {self.custom_order.full_name} by {self.created_by.username}"