from django import forms
from .models import Post


class SearchPostsForm(forms.ModelForm):
    input = forms.CharField(max_length=140)
    class Meta:
        model = Post
        fields = ['input']
