from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model


User = get_user_model()

class UserRegisterViewTests(APITestCase):
    
    def setUp(self):
        
        # (e.g., path('register/', UserRegisterView.as_view(), name='register'))
        self.register_url = reverse('register')

    def test_successful_user_registration(self):
        """Ensure a user can successfully register with valid data."""
        payload = {
            'email': 'newuser@example.com',
            'password': 'StrongPassword123!'
        }
        
        response = self.client.post(self.register_url, payload, format='json')
        
        # Assert the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Assert that the user was actually created in the database
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'newuser')

    def test_registration_missing_required_fields(self):
        """Ensure registration fails with a 400 Bad Request if fields are missing."""
        payload = {
            'email': '',
            'password': ''
        }
        
        response = self.client.post(self.register_url, payload, format='json')
        
        # Assert the response status is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert no user was created
        self.assertEqual(User.objects.count(), 0)