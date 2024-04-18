

var poly = new Array();
function simplify(poly) {

    newPoly = [];

    // Start at the first point
    currentPoint = poly[0];
    newPoly.push(currentPoint);

    // Find out the point that we are going to next
    nextPoint = poly.getNextPointFrom(currentPoint);

    do {

    console.log(newPoly);
        // Create a segment from where I am now 
        // to the point I want to get to.
        currentSegment = new Segment(currentPoint, nextPoint);

        // Find all the intersections between that segment 
        // and each segment in the other polgon
        intersections = currentSegment.selfIntersectWith(poly);

        if(intersections.length == 0)
        {
            // No intersections
            // Add the next point to the new polygon we are constructing
            newPoly.push(nextPoint);

            // move ahead
            currentPoint = nextPoint;

            // get the next point we are trying to go to
            nextPoint = poly.getNextPointFrom(currentPoint);
        }
        else
        {
            // Otherwise, we need to find the closest intersection
            closestIntersection = intersections[0];

            // Add the point of intersection to our new polygon
            newPoly.push(closestIntersection.intersectionPoint);

            // Set our current point to the intersection point
            currentPoint = closestIntersection.intersectionPoint;

            // Set the 'destination' point to the *end* point of the segment
            // that we intersected with
            nextPoint = closestIntersection.endPoint;
        }

        // keep going until you get back to the point you started at
    } while (currentPoint != poly[0] );

    // Done
    return newPoly;
}

function Segment(a,b) {
    this.a = a;
    this.b = b;
}

function intersection(p1, p2, p3, p4) {
    var x1 = p1.x, x2 = p2.x, x3 = p3.x, x4 = p4.x;
    var y1 = p1.y, y2 = p2.y, y3 = p3.y, y4 = p4.y;
    var z1= (x1 -x2), z2 = (x3 - x4), z3 = (y1 - y2), z4 = (y3 - y4);
    var d = z1 * z4 - z3 * z2;
     
    // If d is zero, there is no intersection
    if (d == 0) return null;

    // Get the x and y
    var pre = (x1*y2 - y1*x2), post = (x3*y4 - y3*x4);
    var x = ( pre * z2 - z1 * post ) / d;
    var y = ( pre * z4 - z3 * post ) / d;
     
    // Check if the x and y coordinates are within both lines
    if ( x < Math.min(x1, x2) || x > Math.max(x1, x2) ||
    x < Math.min(x3, x4) || x > Math.max(x3, x4) ) return null;
    if ( y < Math.min(y1, y2) || y > Math.max(y1, y2) ||
    y < Math.min(y3, y4) || y > Math.max(y3, y4) ) return null;
     
    // Return the point of intersection
    return new Point(x, y);
}

Segment.prototype.selfIntersectWith = function(poly) {
    var ret = [];

    var totalLen = Math.sqrt(Math.pow(this.a.x-this.b.x,2)+Math.pow(this.a.y-this.b.y,2))

    for(var i=0;i<poly.length;i++) {

        var c = poly[i];
        var d = poly.getNextPointFrom(c);

        console.log(this.a,this.b, c,d);

        if(d == this.b) continue;
        //if(c == this.b) continue; 
        //if(d == this.a) continue; 
        //if(c == this.a) continue;
        
        var ints = intersection(this.a, this.b, c, d);
        if(ints != null) 
        {
            var len = Math.sqrt(Math.pow(this.a.x-ints.x,2)+Math.pow(this.a.y-ints.y,2))
            
            if(len > 0.1 && len < totalLen) {
                ret.push({
                    a: this.a,
                    b: this.b,
                    startPoint: c,
                    intersectionPoint: ints,
                    endPoint: d,
                    length: len
                })
            }
        }
    }

    ret.sort(function(a,b) { return a.length-b.length; })

    console.log(ret);
    return ret;
};

function Point(x,y) {
    this.x = x;
    this.y = y;
}

function generatePoly(listPoints){
for(var i=0;i<=listPoints.length-1;i++)
{
    poly.push(new Point(listPoints[i][0],listPoints[i][1]));
}
var res=simplify(poly);
return res;
}


poly.getNextPointFrom = function(p) {
    return this[(this.indexOf(p) + 1) % this.length];
}