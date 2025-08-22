from django.urls import path
from .views import *


urlpatterns = [
    path('categories', CategoryListView.as_view(), name='category-list'),
    path('products', ProductListView.as_view(), name='product-list'),  
    path('product/<int:pk>', ProductDetailView.as_view(), name='product-detail'),

     # Custom Order CRUD
    path('custom-orders/', CustomOrderCreateView.as_view(), name='custom-order-create'),
    path('custom-orders/list/', CustomOrderListView.as_view(), name='custom-order-list'),
    path('custom-orders/stats/', CustomOrderStatsView.as_view(), name='custom-order-stats'),
    path('custom-orders/<uuid:order_id>/', CustomOrderDetailView.as_view(), name='custom-order-detail'),
    path('custom-orders/<uuid:order_id>/status/', CustomOrderStatusUpdateView.as_view(), name='custom-order-status-update'),
    path('custom-orders/<uuid:order_id>/notes/', CustomOrderNoteView.as_view(), name='custom-order-note'),
]   