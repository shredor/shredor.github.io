function Slider(selector) {
    var sliderNode = document.querySelector(selector),
        sliderImagesNode = sliderNode.querySelector('.slider__images-wrap'),
        prevSliderNode = sliderNode.querySelector('.slider__pager_previous'),
        nextSliderNode = sliderNode.querySelector('.slider__pager_next'),
        paginationNode = sliderNode.querySelector('.slider__pagination');

    var imagesCount = sliderImagesNode.children.length,
        slideSize = sliderImagesNode.offsetWidth;


    function replaceLastToFirst(node){
        node.insertBefore(node.lastElementChild, node.firstElementChild)
    }
    function replaceFirstToLast(node){
        node.appendChild(node.firstElementChild)
    }
    function slideAutoReplace() {
        var offsetedPagesMaxCount = imagesCount - 1;
        var marginLeft = parseInt(sliderImagesNode.style.marginLeft) || 0;
        var leftPages = (- marginLeft / slideSize);
        var rightPages =  imagesCount - leftPages - 1;
        if (leftPages == offsetedPagesMaxCount) {
            replaceFirstToLast(sliderImagesNode);
            sliderImagesNode.style.marginLeft = marginLeft + slideSize + 'px';
        }
        if (rightPages == offsetedPagesMaxCount) {
            replaceLastToFirst(sliderImagesNode);
            sliderImagesNode.style.marginLeft = marginLeft - slideSize + 'px';
        }
    }
    function animate(duration, dir, complete) {
        slideAutoReplace();
        var startMarginLeft = parseInt(sliderImagesNode.style.marginLeft);
        function draw(progress) {
            sliderImagesNode.style.marginLeft = startMarginLeft - dir * slideSize * progress + 'px';
        }
        var startTime = performance.now();
        requestAnimationFrame(function animate() {

            var timePassed = performance.now() - startTime;

            if (timePassed > duration) timePassed = duration;

            draw(timePassed / duration );

            if (timePassed < duration) {
                requestAnimationFrame(animate);
            }

            if (timePassed == duration) {
                complete();
            }
        })
    }

    function createPagination() {
        var first = paginationNode.firstElementChild;
        first.classList.remove('hidden');
        for (var i = 0; i < imagesCount - 1; i++) {
            var nextNode = first.cloneNode(true);
            nextNode.firstElementChild.dataset.slider__item = i + 1 + "";
            nextNode.firstElementChild.classList.remove('active');
            paginationNode.appendChild(nextNode);
        }
    }
    function init() {
        createPagination();
        animate(1,0, function(){
            isAnimated = false;
        });
    }


    var duration = 500;
    var isAnimated = false;
    var currentSlide = 0;
    nextSliderNode.onclick = function(e) {
        e.preventDefault();
        if (!isAnimated) {
            isAnimated = true;
            animate(duration, 1, function(){
                isAnimated = false;
                paginationNode.querySelector('[data-slider__item = "' + currentSlide + '"]').classList.remove('active');
                currentSlide = (currentSlide == imagesCount - 1) ? 0 : (currentSlide + 1);
                paginationNode.querySelector('[data-slider__item = "' + currentSlide + '"]').classList.add('active');
            });
        }
    };
    prevSliderNode.onclick = function(e) {
        e.preventDefault();
        if (!isAnimated) {
            isAnimated = true;
            animate(duration, -1, function(){
                isAnimated = false;
                paginationNode.querySelector('[data-slider__item = "' + currentSlide + '"]').classList.remove('active');
                currentSlide = (currentSlide == 0) ? (imagesCount - 1) : (currentSlide - 1);
                paginationNode.querySelector('[data-slider__item = "' + currentSlide + '"]').classList.add('active');
            });
        }
    };

    paginationNode.onclick = function(e) {
        e.preventDefault();
        var link = e.target;
        if (link.tagName != 'A' || isAnimated) {return};
        var steps = link.dataset.slider__item - currentSlide;
        if (!steps) {return};
        isAnimated = true;
        var newDirection = steps / Math.abs(steps);
        var paginationStepDuration = duration / Math.abs(steps);
        var firstSlide = currentSlide;
        animate(paginationStepDuration, newDirection, function f(){
            if (currentSlide + newDirection < 0) {
                currentSlide = imagesCount - 1;
            } else if (currentSlide + newDirection == imagesCount) {
                currentSlide = 0;
            } else {
                currentSlide = currentSlide + newDirection;
            }
            steps = Math.abs(steps) - 1;
            if (steps) {
                animate(paginationStepDuration, newDirection, f);
            } else {
                isAnimated = false;
                paginationNode.querySelector('[data-slider__item = "' + firstSlide + '"]').classList.remove('active');
                paginationNode.querySelector('[data-slider__item = "' + currentSlide + '"]').classList.add('active');
            }

        })

    };

    init();
}

