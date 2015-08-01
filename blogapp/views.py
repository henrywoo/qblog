from django.shortcuts import render,render_to_response
from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic.dates import MonthArchiveView
from .models import Post
from .forms import PostForm

from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

BLOGPERPAGE=5

class ArticleMonthArchiveView(MonthArchiveView):
    queryset = Post.objects.all()
    date_field = "published_date"
    allow_future = True

def post_draft_list(request):
    posts = Post.objects.filter(published_date__isnull=True).order_by('-created_date')
    return render(request, 'blogapp/post_draft_list.html', {'posts': posts})

@login_required
def post_publish(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.publish()
    return redirect('blogapp.views.post_detail', pk=pk)

@login_required
def post_remove(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.delete()
    return redirect('blogapp.views.post_list')

def post_list(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    paginator = Paginator(posts, BLOGPERPAGE)
    page = request.GET.get('page')

    try:
        ps = paginator.page(page)
    except PageNotAnInteger: # If page is not an integer, deliver first page.
        ps = paginator.page(1)
    except EmptyPage: # If page is out of range (e.g. 9999), deliver last page of results.
        ps = paginator.page(paginator.num_pages)
    '''
    <nav>
    <ul class="pagination pagination-sm">
    <li class="disabled">
      <span>
        <span aria-hidden="true">&laquo;</span>
      </span>
    </li>
    <li class="active">
      <span> 1 </span>
    </li>
    <li class="disabled">
      <span>
        <span aria-hidden="true"> &raquo; </span>
      </span>
    </li>
    </ul>
    </nav>
    '''
    nav='<nav>'
    if ps.has_previous():
        nav=nav+"[< previous](?page={}) | ".format(ps.previous_page_number())
    nav = nav + "Page {} of {}".format(ps.number,ps.paginator.num_pages)
    if ps.has_next():
        nav=nav+" | [next >](?page={})".format(ps.next_page_number())
    nav=nav+'</nav>'

    return render(request, 'blogapp/index.html', {'ps': ps,'nav': nav})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blogapp/post_detail.html', {'post': post})

@login_required
def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('blogapp.views.post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'blogapp/post_edit.html', {'form': form})

@login_required
def post_edit(request, pk):
    #print "pk: ",pk
    post = get_object_or_404(Post, pk=pk)
    #print "post: ",post
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('blogapp.views.post_detail', pk=post.pk)
        else:
            print "form is invalid:", form
    else:
        form = PostForm(instance=post)
    return render(request, 'blogapp/post_edit.html', {'form': form})
    #return render_to_response('blogapp/edit.html', {'form': form, 'post':post})

from django.http import HttpResponseRedirect
def index(request):
    #return render(request, 'index.html')
    return HttpResponseRedirect("/post/48/")

def about(request):
    return HttpResponseRedirect("/post/58/")
