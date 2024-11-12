var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
document.addEventListener('DOMContentLoaded', function () {
    var getPostBtn = document.getElementById('getPostBtn');
    var postsContainer = document.getElementById('postsContainer');
    var loginModal = document.getElementById('loginModal');
    var closeButton = document.querySelector('.close-button');
    var loginBtn = document.getElementById('loginBtn');
    var loginForm = document.getElementById('loginForm');
    // Store liked posts using an array
    var likedPosts = [];
    var createLikeButton = function (postId) {
        var likedClass = likedPosts.indexOf(postId) > -1 ? 'liked' : '';
        return "\n            <button class=\"like-button ".concat(likedClass, "\" data-post-id=\"").concat(postId, "\">\n                <div class=\"like-wrapper\">\n                    <div class=\"ripple\"></div>\n                    <svg class=\"heart\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n                        <path d=\"M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z\"></path>\n                    </svg>\n                    <div class=\"particles\" style=\"--total-particles: 6\">\n                        <div class=\"particle\" style=\"--i: 1; --color: #7642F0\"></div>\n                        <div class=\"particle\" style=\"--i: 2; --color: #AFD27F\"></div>\n                        <div class=\"particle\" style=\"--i: 3; --color: #DE8F4F\"></div>\n                        <div class=\"particle\" style=\"--i: 4; --color: #D0516B\"></div>\n                        <div class=\"particle\" style=\"--i: 5; --color: #5686F2\"></div>\n                        <div class=\"particle\" style=\"--i: 6; --color: #D53EF3\"></div>\n                    </div>\n                </div>\n            </button>\n        ");
    };
    
    var fetchRandomPost = function () {
        var randomId = Math.floor(Math.random() * 100) + 1;
        fetch("https://jsonplaceholder.typicode.com/posts/".concat(randomId))
            .then(function (response) { return response.json(); })
            .then(function (post) {
            var postElement = document.createElement('div');
            postElement.className = 'post highlight';
            postElement.innerHTML = "\n                    <h2>".concat(post.title, "</h2>\n                    <p>").concat(post.body, "</p>\n                    ").concat(createLikeButton(post.id), "\n                ");
            postsContainer === null || postsContainer === void 0 ? void 0 : postsContainer.insertBefore(postElement, postsContainer.firstChild);
            setTimeout(function () {
                postElement.classList.remove('highlight');
            }, 1000);
            var likeButton = postElement.querySelector('.like-button');
            if (likeButton) {
                setupLikeButtonAnimation(likeButton);
            }
        })
            .catch(function (error) {
            console.error('Error fetching post:', error);
            alert('Failed to fetch post. Please try again.');
        });
    };
    var setupLikeButtonAnimation = function (button) {
        var isAnimating = false;
        button.addEventListener('click', function () {
            if (isAnimating)
                return;
            isAnimating = true;
            var postId = parseInt(button.dataset.postId || '0');
        
            var index = likedPosts.indexOf(postId);
            if (index > -1) {
                likedPosts.splice(index, 1);
                button.classList.remove('liked');
            }
            else {
                likedPosts.push(postId);
                button.classList.add('liked');
            }
            // animation
            button.focus();
            // Save liked state to local storage!
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            setTimeout(function () {
                button.blur();
                isAnimating = false;
            }, 1000);
        });
    };
    var loadLikedPosts = function () {
        try {
            var saved = localStorage.getItem('likedPosts');
            if (saved) {
                var savedPosts = JSON.parse(saved);
                likedPosts.splice.apply(likedPosts, __spreadArray([0, likedPosts.length], savedPosts, false)); // Reset likedPosts and add saved posts
            }
        }
        catch (error) {
            console.error('Error loading liked posts:', error);
        }
    };
    // Modal 
    var openModal = function () {
        if (loginModal)
            loginModal.style.display = 'block';
    };
    var closeModal = function () {
        if (loginModal)
            loginModal.style.display = 'none';
    };
    
    var handleLogin = function (event) {
        event.preventDefault(); // Preventform from submitting
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        if (username === 'asaf' && password === '12345') {
            console.log('Logged in successfully!');
            closeModal(); 
            alert('Logged in successfully!'); 
        }
        else {
            alert('Invalid username or password. Please try again.'); 
        }
    };
    loadLikedPosts();
    getPostBtn === null || getPostBtn === void 0 ? void 0 : getPostBtn.addEventListener('click', fetchRandomPost);
    if (loginBtn) {
        loginBtn.addEventListener('click', openModal);
    }
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    window.addEventListener('click', function (event) {
        if (event.target === loginModal) {
            closeModal();
        }
    });
});
