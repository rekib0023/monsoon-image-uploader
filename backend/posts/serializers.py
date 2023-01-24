from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Post
        fields = "__all__"

    def save(self, **kwargs):
        if self.instance is None:
            kwargs["created_by"] = self.fields["created_by"].get_default()
        return super().save(**kwargs)
