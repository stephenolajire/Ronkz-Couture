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
from django.shortcuts import get_object_or_404


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


class CustomOrderSubmissionView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, *args, **kwargs):
        serializer = CustomOrderSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            custom_order = serializer.save()
            identity_code = request.data.get('custom_identity')
            if identity_code:
                cart, _ = CustomOrderCart.objects.get_or_create(identity_code=identity_code)
                cart_item = CustomOrderCartItem.objects.create(cart=cart, product=custom_order)
                cart_item.save()
                return Response({
                    'message': 'Custom order created and added to cart successfully',
                    'identity_code': cart.identity_code,
                    'order_id': custom_order.id
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def generate_custom_order_identity_code():
    identity = uuid.uuid4().hex[:8].upper()
    return identity