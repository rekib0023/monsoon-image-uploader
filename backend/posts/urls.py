from django.urls import path

from .views import PostDetailView, PostsView, TagsView

urlpatterns = [
    path("posts", PostsView.as_view(), name="post_create_list"),
    path("posts/<int:id>/", PostDetailView.as_view(), name="post_detail_view"),
    path("tags", TagsView.as_view(), name="tag_view"),
]
