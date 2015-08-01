from django import forms
from .models import Post
from bootstrap_markdown.widgets import MarkdownEditor

class PostForm(forms.ModelForm):
    #text = forms.CharField(widget=MarkdownEditor())

    class Meta:
        model = Post
        widgets = {
          #'text': forms.Textarea(attrs={'rows':40, 'cols':50}),
          'text': MarkdownEditor(attrs={'id': 'title',
                                        'width': "80%",
                                        'height': 400,
                                        'locale': None,
                                        'boostrap_cdn': True,
                                        'autofocus': True,
                                        'resize': 'both',
                                        'icon': 'glyph',
                                        'footer': '> Powered by http://www.codingdrama.com/bootstrap-markdown',
                                        'fullscreen': True,
                                    }),
          'title': forms.TextInput(attrs={'size': 80, 'title': 'Title',})
        }
        fields = ('title', 'text',)
