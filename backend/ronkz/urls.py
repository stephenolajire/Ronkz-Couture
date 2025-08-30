from django.urls import path
from .views import *


urlpatterns = [
    path('categories', CategoryListView.as_view(), name='category-list'),
    path('products', ProductListView.as_view(), name='product-list'),  
    path('product/<int:pk>', ProductDetailView.as_view(), name='product-detail'),

     # Custom Order
    path('custom-orders/', CustomOrderSubmissionView.as_view(), name='custom-order-create'),
    path('custom-order-list/', CustomOrderListView.as_view(), name='custom-order-list'),

    # AddToCartView
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart-items/', CartItemsView.as_view(), name='cart-items')
]   