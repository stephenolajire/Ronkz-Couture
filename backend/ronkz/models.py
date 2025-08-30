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
    whatsapp = models.CharField(max_length=20)
    
    # Design Information
    styleDescription = models.TextField()
    occasion = models.CharField(max_length=20)
    budget = models.CharField(max_length=20)
    timeline = models.DateField()

    # measurement
    neck = models.FloatField(validators=[MinValueValidator(0)], default=12)
    arms = models.FloatField(validators=[MinValueValidator(0)], default=11)
    shoulders = models.FloatField(validators=[MinValueValidator(0)], default=12)
    chest = models.FloatField(validators=[MinValueValidator(0)], default=34)
    waist = models.FloatField(validators=[MinValueValidator(0)], default=28)
    hips = models.FloatField(validators=[MinValueValidator(0)], default=36)
    inseam = models.FloatField(validators=[MinValueValidator(0)], default=32)
    height = models.FloatField(validators=[MinValueValidator(0)], default=60)

    # Images
    image = models.ImageField(upload_to='custom_orders/styles/', null=True, blank=True)
    picture = models.ImageField(upload_to='custom_orders/personal/', null=True, blank=True)
    
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
    

class CustomOrderCart(models.Model):
    identity_code = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.id} - Identity Code: {self.identity_code}"
    

class CustomOrderCartItem(models.Model):
    cart = models.ForeignKey(CustomOrderCart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(CustomOrder, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart Item {self.id} - Product: {self.product.first_name}"
    

class Cart(models.Model):
    cart_code = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.id} - Cart Code: {self.cart_code}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart Item {self.id} - Product: {self.product.name}"