from django.contrib import admin
from .models import Category, Product, CustomOrder, CustomOrderCart, CustomOrderCartItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description')
    list_display_links = ('name', 'slug')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 25


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'slug')
    list_display_links = ('name', 'slug')
    list_filter = ('category', 'price')
    search_fields = ('name', 'description', 'category__name')
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 25
    raw_id_fields = ('category',)


@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'full_name', 'email', 'occasion', 'budget', 
        'status', 'timeline', 'created_at'
    )
    list_display_links = ('id', 'full_name')
    list_filter = ('status', 'occasion', 'budget', 'created_at', 'timeline')
    search_fields = ('first_name', 'last_name', 'email', 'whatsapp')
    readonly_fields = ('id', 'created_at', 'updated_at')
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('first_name', 'last_name', 'email', 'whatsapp', 'user')
        }),
        ('Design Details', {
            'fields': ('styleDescription', 'occasion', 'budget', 'timeline', 'image')
        }),
        ('Measurements', {
            'fields': ('neck', 'arms', 'shoulders', 'chest', 'waist', 'hips', 'inseam', 'height'),
            'classes': ('collapse',)
        }),
        ('Personal Photo', {
            'fields': ('picture',),
        }),
        ('Status & Tracking', {
            'fields': ('status', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        # Optimize queries by selecting related user
        return super().get_queryset(request).select_related('user')


@admin.register(CustomOrderCart)
class CustomOrderCartAdmin(admin.ModelAdmin):
    list_display = ('id', 'identity_code', 'item_count', 'created_at', 'updated_at')
    list_display_links = ('id', 'identity_code')
    search_fields = ('identity_code',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = 'Items Count'
    
    def get_queryset(self, request):
        # Optimize queries by prefetching related items
        return super().get_queryset(request).prefetch_related('items')


@admin.register(CustomOrderCartItem)
class CustomOrderCartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart_identity', 'product_name', 'created_at')
    list_display_links = ('id',)
    list_filter = ('created_at',)
    search_fields = ('cart__identity_code', 'product__first_name', 'product__last_name')
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25
    raw_id_fields = ('cart', 'product')
    date_hierarchy = 'created_at'
    
    def cart_identity(self, obj):
        return obj.cart.identity_code
    cart_identity.short_description = 'Cart Identity'
    
    def product_name(self, obj):
        return f"{obj.product.first_name} {obj.product.last_name}"
    product_name.short_description = 'Customer Name'
    
    def get_queryset(self, request):
        # Optimize queries by selecting related cart and product
        return super().get_queryset(request).select_related('cart', 'product')