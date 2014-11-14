angular.module('starter.sortable', [])
.directive('sortable', ['$ionicGesture', '$ionicScrollDelegate', function ($ionicGesture, $ionicScrollDelegate) {
    return {
        restrict: 'A',
        scope: {
            draggable: '@',
            sorted: '='
        },
        link: function (scope, element, attrs) {

            var settings = {
                draggable: scope.draggable ? scope.draggable : '.card',
                duration: 200
            };

            var dragging = null, placeholder = null, offsetY = 0, marginTop = 0;
            var cardSet, initialIndex, currentIndex, animating = false;

            var placeholderHeight;
            var scrollInterval;

            var createPlaceholder = function createPlaceholder(height) {
                // Use marginTop to compensate for extra margin when inserting the placeholder
                return $('<div></div>')
                        .css({
                            height: height + 'px',
                            marginTop: (currentIndex > 0 ? -(marginTop + 1) : -1) + 'px'
                        })
                        .addClass('placeholder');
            };

            $ionicGesture.on('hold', function (e) {
                // Get the element we're about to start dragging
                dragging = angular.element(e.target).closest(settings.draggable);
                if (!dragging.length) dragging = null;

                if (dragging) {
                    // Get the initial index
                    initialIndex = currentIndex = dragging.index(settings.draggable);

                    // Get relative position of touch
                    var clientY = e.gesture.touches[0].clientY;
                    var position = dragging.position();
                    offsetY = clientY - position.top - element.offset().top;

                    // Switch to Absolute position at same location
                    dragging.css({
                        position: 'absolute',
                        zIndex: 1000,
                        left: position.left + 'px',
                        top: position.top + 'px',
                        width: dragging.outerWidth() + 'px'
                    })
                    .addClass('dragging');

                    cardSet = element.find(settings.draggable + ':not(.dragging)');

                    marginTop = parseInt(dragging.css('marginTop'));
                    // Replace with placeholder
                    placeholderHeight = dragging.outerHeight() + marginTop + 1;
                    placeholder = createPlaceholder(placeholderHeight);
                    placeholder.insertAfter(dragging);

                    // Interval to handle auto-scrolling window when at top or bottom
                    initAutoScroll();
                    scrollInterval = setInterval(autoScroll, 20);
                }
            }, element);

            $ionicGesture.on('touchmove', function (e) {
                if (dragging) {
                    e.stopPropagation();
                    touchY = e.touches[0].clientY;
                    var newTop = touchY - offsetY - element.offset().top;

                    // Reposition the dragged element
                    dragging.css({
                        top: newTop + 'px'
                    });

                    // Check for position in the list
                    var newIndex = 0;
                    cardSet.each(function (i) {
                        var card = $(this);
                        if (newTop > card.position().top) {
                            newIndex = i + 1;
                        }
                    });

                    if (!animating && newIndex !== currentIndex) {
                        currentIndex = newIndex;

                        var oldPlaceholder = placeholder;
                        // Animate in a new placeholder
                        placeholder = createPlaceholder(1);

                        // Put it in the right place
                        if (newIndex < cardSet.length) {
                            placeholder.insertBefore(cardSet.eq(newIndex));
                        } else {
                            placeholder.insertAfter(cardSet.eq(cardSet.length - 1));
                        }

                        // Animate the new placeholder to full height
                        animating = true;
                        setTimeout(function () {
                            placeholder.css('height', placeholderHeight + 'px');
                            // Animate out the old placeholder
                            oldPlaceholder.css('height', 1);

                            setTimeout(function () {
                                oldPlaceholder.remove();
                                animating = false;
                            }, settings.duration);
                        }, 50);
                    }


                }
            }, element);

            $ionicGesture.on('release', function (e) {
                if (dragging) {
                    // Set element back to normal
                    dragging.css({
                        position: '',
                        zIndex: '',
                        left: '',
                        top: '',
                        width: ''
                    }).removeClass('dragging');

                    // Remove placeholder
                    placeholder.remove();
                    placeholder = null;

                    if (initialIndex !== currentIndex && scope.sorted) {
                        scope.$apply(function () {
                            scope.sorted(initialIndex, currentIndex);
                        });
                    }
                    dragging = null;

                    clearInterval(scrollInterval);
                }
            }, element);

            // Autoscroll function to scroll window up and down
            var touchY, scrollHeight, containerTop, maxScroll;
            var scrollBorder = 80, scrollSpeed = 0.2;
            var initAutoScroll = function initAutoScroll() {
                touchY = -1;
                var scrollArea = element.closest('.scroll');
                var container = scrollArea.parent();
                scrollHeight = container.height();
                containerTop = container.position().top;
                maxScroll = scrollArea.height() - scrollHeight;
            };

            var autoScroll = function autoScroll() {
                var scrollChange = 0;
                if (touchY >= 0 && touchY < containerTop + scrollBorder) {
                    scrollChange = touchY - (containerTop + scrollBorder);
                } else if (touchY >= 0 && touchY > scrollHeight - scrollBorder) {
                    scrollChange = touchY - (scrollHeight - scrollBorder);
                }

                if (scrollChange !== 0) {
                    var newScroll = $ionicScrollDelegate.getScrollPosition().top + scrollSpeed * scrollChange;
                    if (newScroll < 0)
                        newScroll = 0;
                    else if (newScroll > maxScroll)
                        newScroll = maxScroll;

                    $ionicScrollDelegate.scrollTo(0, newScroll, false);
                }
            };

        }
    };
}]);
