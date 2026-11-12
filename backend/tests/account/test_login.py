from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model


User = get_user_model()

class UserDetailViewTests(APITestCase):
    
    def setUp(self):
        
        # (e.g., path("account/profile", UserDetailView.as_view(), name = "UserData"))
        self.profile_url = reverse('UserData')

        """Generate User to test"""
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='StrongPassword123!',
            first_name='Pls',
            last_name='Work'
        )

    def test_get_user_profile_authenticated(self):
        """Ensure an authenticated user can successfully fetch their profile data."""
        
        # 3. Authenticate the test client using force_authenticate (or by obtaining a token)
        self.client.force_authenticate(user=self.user)

        # 4. Make a GET request to the profile endpoint
        response = self.client.get(self.profile_url)

        # 5. Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'testuser@example.com')
        self.assertEqual(response.data['first_name'], 'Pls')
        self.assertEqual(response.data['last_name'], 'Work')

    def test_get_user_profile_unauthenticated(self):
        """Ensure unauthenticated users cannot access the profile endpoint."""
        
        # Do NOT authenticate the client
        response = self.client.get(self.profile_url)

        # Should be forbidden or unauthorized (depending on your permission_classes)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_user_error(self):
        """Ensure wrong method on API call returns error code"""
        
        # Authenticate the test client using force_authenticate (or by obtaining a token)
        self.client.force_authenticate(user=self.user)

        # Make a POST request to the profile endpoint
        response = self.client.post(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

