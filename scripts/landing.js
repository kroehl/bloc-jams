var animatePoints = function () {
 
    var points = document.getElementsByClassName('point');
    var revealPoint = function (i) {
        // modify the point's style
        points[i].style.opacity = 1;
        points[i].style.transform = "scaleX(1) translateY(0)";
        points[i].style.msTransform = "scaleX(1) translateY(0)";
        points[i].style.WebkitTransform = "scaleX(1) translateY(0)"; 
    };
    
    for(var i=0, length = points.length; i < length; i++){
        
        // call revealPoint and pass in the 
        // point element at the index of `i` in the
        // `points` collection
        revealPoint(i);    
    }
};
    

 

            
           
            
 