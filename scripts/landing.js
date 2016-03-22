var pointsArray = document.getElementsByClassName('point');

var revealPoint = function (point) {
        //modify the point's style
        point.style.opacity = 1;
        point.style.transform = "scaleX(1)translateY(0)";
        point.style.msTransform = "scaleX(1)translateY(0)";
        point.style.WebkitTransform = "scaleX(1)translateY(0)"; 
};

var animatePoints = function(points) {
    forEach (points, revealPoint);
};
    
window.onload = function(){
    
    if (window.innerHeight > 950){
        animatePoints(pointsArray);
    }
<<<<<<< HEAD
=======
    
    //var sellingPoints = document.getElementsByClassName("selling-points")[0];
    //var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    window.addEventListener('scroll', function(event){
        if (pointsArray[0].getBoundingClientRect().top <= 500){
            animatePoints(pointsArray);
        
        }
    });
}

>>>>>>> 6a63587faa1ae2ed8517c162ca3b48b20760f2ba
    

    
    window.addEventListener('scroll', function(event){
        if (pointsArray[0].getBoundingClientRect().top <= 500){
            animatePoints(pointsArray);
        
        }
    });
}

            
           
            
 