from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=100, null=False)
    image = models.ImageField(null=True, blank=True, upload_to="images/")
    isFavourite = models.BooleanField(default=False)

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s" % self.title

    class Meta:
        ordering = ["-created_at"]
