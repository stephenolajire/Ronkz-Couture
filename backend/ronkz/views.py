from decimal import Decimal
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
from django.db.models import Sum, F


# Create your views here.
class CategoryListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        categories = Category.objects.all()[:4]
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
    

class CustomOrderListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        identity_code = request.query_params.get('identity_code')
        if not identity_code:
            return Response({'error': 'Custom identity code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = CustomOrderCart.objects.get(identity_code=identity_code)
            cart_items = CustomOrderCartItem.objects.filter(cart=cart)
            serializer = CustomOrderCartItemSerializer(cart_items, many=True, context={'request': request})
            return Response({
                'identity_code': cart.identity_code,
                'items': serializer.data
            }, status=status.HTTP_200_OK)
        except CustomOrderCart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        

    def delete(self, request, *args, **kwargs):
        product_code = request.query_params.get('product_code')
        identity_code = request.query_params.get('identity_code')
        if not product_code or not identity_code:
            return Response({'error': 'Product code and identity code are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = CustomOrderCart.objects.get(identity_code=identity_code)
            cart_items = CustomOrderCartItem.objects.filter(cart=cart)
            item_to_delete = cart_items.filter(product__id=product_code).first()
            if item_to_delete:
                item_to_delete.delete()
                return Response({'message': 'Item removed from cart successfully'}, status=status.HTTP_204_NO_CONTENT)
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        except CustomOrderCart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        

class AddToCartView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        try:
            cart_code = request.data.get('cart_code')
            product_id = request.data.get('productId')
            quantity = request.data.get('quantity', 1)

            cart, _ = Cart.objects.get_or_create(cart_code=cart_code)
            product = Product.objects.get(id=product_id)

            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
            cart_item.save()

            return Response({
                'message': 'Product added to cart successfully',
                'cart_code': cart.cart_code,
                'item_id': cart_item.id,
                'quantity': cart_item.quantity
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CartItemsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        cart_code = request.query_params.get('cart_code')
        if not cart_code:
            return Response({'error': 'Cart code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(cart_code=cart_code)
            cart_items = CartItem.objects.filter(cart=cart)
            total_price = cart_items.aggregate(
                total=Sum(F('product__price') * F('quantity'))
            )['total'] or Decimal('0.00')
            serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
            return Response({
                'cart_code': cart.cart_code,
                'items': serializer.data,
                'total_price': total_price
            }, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        item_id = request.data.get('productId')
        cart_code = request.data.get('cart_code')
        if not item_id or not cart_code:
            return Response({'error': 'Item ID and cart code are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(cart_code=cart_code)
            cart_item = CartItem.objects.filter(cart=cart, id=item_id).first()
            if cart_item:
                cart_item.delete()
                return Response({'message': 'Item removed from cart successfully'}, status=status.HTTP_204_NO_CONTENT)
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)


    def patch(self, request, *args, **kwargs):
        item_id = request.data.get('itemId')
        cart_code = request.data.get('cart_code')
        quantity = request.data.get('quantity')

        if not item_id or not cart_code:
            return Response({'error': 'Item ID and cart code are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(cart_code=cart_code)
            cart_item = CartItem.objects.filter(cart=cart, id=item_id).first()
            if cart_item:
                cart_item.quantity = quantity
                cart_item.save()
                return Response({'message': 'Cart item updated successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
