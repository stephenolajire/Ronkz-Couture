from django.urls import path
from .views import *


urlpatterns = [
    path('categories', CategoryListView.as_view(), name='category-list'),
    path('products', ProductListView.as_view(), name='product-list'),  
    path('product/<int:pk>', ProductDetailView.as_view(), name='product-detail'),
]   