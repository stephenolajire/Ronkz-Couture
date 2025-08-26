from django.shortcuts import render
from .serializers import*
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import logging


# Create your views here.
class CategoryListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)
    
class ProductListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            # Get category from query parameters
            category_slug = request.query_params.get('category', None)
            
            if category_slug:
                # Filter by category slug
                category = get_object_or_404(Category, slug=category_slug)
                products = Product.objects.filter(category=category)
            else:
                # Return all products
                products = Product.objects.all()
            
            # Additional filtering options
            search = request.query_params.get('search', None)
            if search:
                products = products.filter(name__icontains=search)
            
            # Price filtering
            min_price = request.query_params.get('min_price', None)
            max_price = request.query_params.get('max_price', None)
            
            if min_price:
                try:
                    min_price = float(min_price)
                    products = products.filter(price__gte=min_price)
                except (ValueError, TypeError):
                    return Response(
                        {'error': 'Invalid min_price value. Must be a number.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if max_price:
                try:
                    max_price = float(max_price)
                    products = products.filter(price__lte=max_price)
                except (ValueError, TypeError):
                    return Response(
                        {'error': 'Invalid max_price value. Must be a number.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Ordering
            ordering = request.query_params.get('ordering', 'name')
            if ordering:
                # Validate ordering field to prevent errors
                valid_ordering_fields = ['name', '-name', 'price', '-price', 'created_at', '-created_at']
                if ordering in valid_ordering_fields:
                    products = products.order_by(ordering)
                else:
                    # Default to name if invalid ordering is provided
                    products = products.order_by('name')
            
            serializer = ProductSerializer(products, many=True, context={'request': request})
            return Response({
                'count': products.count(),
                'results': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Category.DoesNotExist:
            return Response(
                {'error': 'Category not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Something went wrong fetching products'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



from .models import CustomOrder, CustomerMeasurement, CustomOrderNote
from .serializers import (
    CustomOrderSerializer, 
    CustomOrderListSerializer,
    CustomOrderStatusUpdateSerializer,
    CustomOrderNoteSerializer
)

logger = logging.getLogger(__name__)


class CustomOrderCreateView(APIView):
    """
    Create a new custom order
    POST /api/custom-orders/
    """
    permission_classes = [AllowAny]  # Allow non-authenticated users
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def post(self, request):
        try:
            # Add user to context if authenticated
            context = {'user': request.user if request.user.is_authenticated else None}
            
            serializer = CustomOrderSerializer(data=request.data, context=context)
            
            if serializer.is_valid():
                with transaction.atomic():
                    custom_order = serializer.save()
                    
                    logger.info(f"Custom order created: {custom_order.id} by {custom_order.email}")
                    
                    return Response({
                        'success': True,
                        'message': 'Custom order created successfully!',
                        'data': CustomOrderSerializer(custom_order).data
                    }, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Custom order validation failed: {serializer.errors}")
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Error creating custom order: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while creating your order. Please try again.',
                'error': str(e) if request.user.is_staff else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomOrderListView(APIView):
    """
    List all custom orders (admin only) or user's custom orders
    GET /api/custom-orders/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # If user is staff, show all orders; otherwise, show only their orders
            if request.user.is_staff:
                queryset = CustomOrder.objects.all()
            else:
                queryset = CustomOrder.objects.filter(
                    user=request.user
                ) if request.user.is_authenticated else CustomOrder.objects.none()
            
            # Filtering
            status_filter = request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            occasion_filter = request.query_params.get('occasion')
            if occasion_filter:
                queryset = queryset.filter(occasion=occasion_filter)
            
            # Ordering
            ordering = request.query_params.get('ordering', '-created_at')
            if ordering in ['created_at', '-created_at', 'timeline', '-timeline', 'status']:
                queryset = queryset.order_by(ordering)
            
            # Pagination (simple limit/offset)
            limit = int(request.query_params.get('limit', 20))
            offset = int(request.query_params.get('offset', 0))
            
            total_count = queryset.count()
            orders = queryset[offset:offset + limit]
            
            serializer = CustomOrderListSerializer(orders, many=True)
            
            return Response({
                'success': True,
                'data': serializer.data,
                'total': total_count,
                'limit': limit,
                'offset': offset
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error listing custom orders: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while fetching orders.',
                'error': str(e) if request.user.is_staff else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomOrderDetailView(APIView):
    """
    Retrieve, update, or delete a custom order
    GET/PUT/DELETE /api/custom-orders/{id}/
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_object(self, request, order_id):
        """Get custom order with proper permissions"""
        if request.user.is_staff:
            return get_object_or_404(CustomOrder, id=order_id)
        else:
            return get_object_or_404(CustomOrder, id=order_id, user=request.user)
    
    def get(self, request, order_id):
        """Get custom order details"""
        try:
            custom_order = self.get_object(request, order_id)
            serializer = CustomOrderSerializer(custom_order)
            
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except CustomOrder.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Custom order not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving custom order {order_id}: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while fetching the order.',
                'error': str(e) if request.user.is_staff else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, order_id):
        """Update custom order"""
        try:
            custom_order = self.get_object(request, order_id)
            
            # Only allow updates if order is not completed or cancelled
            if custom_order.status in ['completed', 'cancelled'] and not request.user.is_staff:
                return Response({
                    'success': False,
                    'message': 'Cannot update completed or cancelled orders.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = CustomOrderSerializer(
                custom_order, 
                data=request.data, 
                partial=True,
                context={'user': request.user}
            )
            
            if serializer.is_valid():
                with transaction.atomic():
                    updated_order = serializer.save()
                    
                    logger.info(f"Custom order updated: {updated_order.id} by {request.user.email}")
                    
                    return Response({
                        'success': True,
                        'message': 'Custom order updated successfully!',
                        'data': CustomOrderSerializer(updated_order).data
                    }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except CustomOrder.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Custom order not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating custom order {order_id}: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while updating the order.',
                'error': str(e) if request.user.is_staff else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, order_id):
        """Delete custom order (admin only)"""
        if not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Permission denied.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            custom_order = get_object_or_404(CustomOrder, id=order_id)
            custom_order.delete()
            
            logger.info(f"Custom order deleted: {order_id} by {request.user.email}")
            
            return Response({
                'success': True,
                'message': 'Custom order deleted successfully!'
            }, status=status.HTTP_204_NO_CONTENT)
            
        except Exception as e:
            logger.error(f"Error deleting custom order {order_id}: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while deleting the order.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomOrderStatusUpdateView(APIView):
    """
    Update only the status of a custom order (admin only)
    PATCH /api/custom-orders/{id}/status/
    """
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, order_id):
        if not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Permission denied.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            custom_order = get_object_or_404(CustomOrder, id=order_id)
            serializer = CustomOrderStatusUpdateSerializer(
                custom_order, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                logger.info(f"Custom order status updated: {order_id} to {serializer.validated_data['status']}")
                
                return Response({
                    'success': True,
                    'message': 'Order status updated successfully!',
                    'data': {'status': serializer.validated_data['status']}
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except CustomOrder.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Custom order not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating custom order status {order_id}: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while updating the order status.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomOrderNoteView(APIView):
    """
    Add notes to a custom order (admin only)
    POST /api/custom-orders/{id}/notes/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, order_id):
        if not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Permission denied.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            custom_order = get_object_or_404(CustomOrder, id=order_id)
            
            serializer = CustomOrderNoteSerializer(data=request.data)
            if serializer.is_valid():
                note = serializer.save(
                    custom_order=custom_order,
                    created_by=request.user
                )
                
                logger.info(f"Note added to custom order: {order_id} by {request.user.email}")
                
                return Response({
                    'success': True,
                    'message': 'Note added successfully!',
                    'data': CustomOrderNoteSerializer(note).data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except CustomOrder.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Custom order not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error adding note to custom order {order_id}: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while adding the note.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomOrderStatsView(APIView):
    """
    Get custom order statistics (admin only)
    GET /api/custom-orders/stats/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Permission denied.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            from django.db.models import Count, Q
            from datetime import datetime, timedelta
            
            # Basic stats
            total_orders = CustomOrder.objects.count()
            pending_orders = CustomOrder.objects.filter(status='pending').count()
            in_progress_orders = CustomOrder.objects.filter(status='in_progress').count()
            completed_orders = CustomOrder.objects.filter(status='completed').count()
            cancelled_orders = CustomOrder.objects.filter(status='cancelled').count()
            
            # Orders by occasion
            occasion_stats = CustomOrder.objects.values('occasion').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Recent orders (last 30 days)
            thirty_days_ago = datetime.now() - timedelta(days=30)
            recent_orders = CustomOrder.objects.filter(
                created_at__gte=thirty_days_ago
            ).count()
            
            return Response({
                'success': True,
                'data': {
                    'total_orders': total_orders,
                    'status_breakdown': {
                        'pending': pending_orders,
                        'in_progress': in_progress_orders,
                        'completed': completed_orders,
                        'cancelled': cancelled_orders
                    },
                    'occasion_stats': occasion_stats,
                    'recent_orders_30_days': recent_orders
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching custom order stats: {str(e)}")
            return Response({
                'success': False,
                'message': 'An error occurred while fetching statistics.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)