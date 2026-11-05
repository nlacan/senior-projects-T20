from django.contrib import admin
from django.urls import path, include
from account.views import UserRegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("register/", UserRegisterView.as_view(), name = "register"),
    path("account/token/", TokenObtainPairView.as_view(), name = "get_token"),
    path("account/token/refresh", TokenRefreshView.as_view(), name = "refresh"),
    path("account-auth/", include("rest_framework.urls")),
]
