interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

document.addEventListener('DOMContentLoaded', (): void => {
    const getPostBtn: HTMLButtonElement | null = document.getElementById('getPostBtn') as HTMLButtonElement;
    const postsContainer: HTMLDivElement | null = document.getElementById('postsContainer') as HTMLDivElement;
    const loginModal: HTMLElement | null = document.getElementById('loginModal');
    const closeButton: HTMLElement | null = document.querySelector('.close-button');
    const loginBtn: HTMLButtonElement | null = document.getElementById('loginBtn') as HTMLButtonElement;
    const loginForm: HTMLFormElement | null = document.getElementById('loginForm') as HTMLFormElement;

    // Store liked posts using an array
    const likedPosts: number[] = [];
    const removedPosts: number[] = []; // Array to keep track of removed posts

    const createLikeButton = (postId: number): string => {
        const likedClass = likedPosts.indexOf(postId) > -1 ? 'liked' : '';
        return `
            <button class="like-button ${likedClass}" data-post-id="${postId}">
                <div class="like-wrapper">
                    <div class="ripple"></div>
                    <svg class="heart" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
                    </svg>
                    <div class="particles" style="--total-particles: 6">
                        <div class="particle" style="--i: 1; --color: #7642F0"></div>
                        <div class="particle" style="--i: 2; --color: #AFD27F"></div>
                        <div class="particle" style="--i: 3; --color: #DE8F4F"></div>
                        <div class="particle" style="--i: 4; --color: #D0516B"></div>
                        <div class="particle" style="--i: 5; --color: #5686F2"></div>
                        <div class="particle" style="--i: 6; --color: #D53EF3"></div>
                    </div>
                </div>
            </button>
        `;
    };

    const createRemoveButton = (postId: number): string => {
        return `
            <button class="remove-button" data-post-id="${postId}">
                X
            </button>
        `;
    };

    // Use Promises without async/await
    const fetchRandomPost = (): void => {
        const randomId: number = Math.floor(Math.random() * 100) + 1;
        fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`)
            .then((response: Response) => response.json())
            .then((post: Post) => {
                const postElement: HTMLDivElement = document.createElement('div');
                postElement.className = 'post highlight';
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    ${createLikeButton(post.id)}
                    ${createRemoveButton(post.id)}
                `;

                postsContainer?.insertBefore(postElement, postsContainer.firstChild);

                setTimeout(() => {
                    postElement.classList.remove('highlight');
                }, 1000);

                const likeButton = postElement.querySelector('.like-button');
                const removeButton = postElement.querySelector('.remove-button');

                if (likeButton) {
                    setupLikeButtonAnimation(likeButton);
                }

                if (removeButton) {
                    setupRemoveButton(removeButton, post.id, postElement);
                }
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                alert('Failed to fetch post. Please try again.');
            });
    };

    const setupLikeButtonAnimation = (button: Element): void => {
        let isAnimating: boolean = false;

        button.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const postId = parseInt((button as HTMLElement).dataset.postId || '0');
            
            // Toggle liked state using an array
            const index = likedPosts.indexOf(postId);
            if (index > -1) {
                likedPosts.splice(index, 1);
                button.classList.remove('liked');
            } else {
                likedPosts.push(postId);
                button.classList.add('liked');
            }

            // Trigger animation
            (button as HTMLButtonElement).focus();

            // Save liked state to localStorage
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

            setTimeout(() => {
                (button as HTMLButtonElement).blur();
                isAnimating = false;
            }, 1000);
        });
    };

    const setupRemoveButton = (button: Element, postId: number, postElement: HTMLDivElement): void => {
        button.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove this post?')) {
                // Remove the post from the DOM
                postElement.remove();

                // Store the removed post in localStorage
                removedPosts.push(postId);
                localStorage.setItem('removedPosts', JSON.stringify(removedPosts));

                alert('Post removed successfully!');
            }
        });
    };

    // Load liked and removed posts from localStorage on page load
    const loadPosts = (): void => {
        try {
            const savedLiked = localStorage.getItem('likedPosts');
            if (savedLiked) {
                const savedPosts: number[] = JSON.parse(savedLiked);
                likedPosts.splice(0, likedPosts.length, ...savedPosts); // Reset likedPosts and add saved posts
            }

            const savedRemoved = localStorage.getItem('removedPosts');
            if (savedRemoved) {
                const savedRemovedPosts: number[] = JSON.parse(savedRemoved);
                removedPosts.splice(0, removedPosts.length, ...savedRemovedPosts); // Reset removedPosts and add saved posts
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    // Modal functionality
    const openModal = (): void => {
        if (loginModal) loginModal.style.display = 'block';
    };

    const closeModal = (): void => {
        if (loginModal) loginModal.style.display = 'none';
    };

    // Handle login form submission
    const handleLogin = (event: Event): void => {
        event.preventDefault(); // Prevent the form from submitting
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        // Check for valid credentials
        if (username === 'asaf' && password === '12345') {
            console.log('Logged in successfully!');
            closeModal(); // Close the modal after login
            alert('Logged in successfully!'); // Notify the user
        } else {
            alert('Invalid username or password. Please try again.'); // Notify the user of invalid credentials
        }
    };

    loadPosts();
    getPostBtn?.addEventListener('click', fetchRandomPost);
    loginBtn?.addEventListener('click', openModal);
    closeButton?.addEventListener('click', closeModal);
    loginForm?.addEventListener('submit', handleLogin);
    

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal();
        }
    });
});
