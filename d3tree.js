var defs;
 $(document).ready(function () {
            
            //build tree
            function BuildVerticaLTree(treeData, treeContainerDom) {
                var margin = { top: 40, right: 120, bottom: 20, left: 120 };
                var width = 960 - margin.right - margin.left;
                var height = 500 - margin.top - margin.bottom;
                
                var i = 0, duration = 750;
                var tree = d3.layout.tree()
                    .size([height, width]);
                var diagonal = d3.svg.diagonal()
                    .projection(function (d) { return [d.x, d.y]; });
                var svg = d3.select(treeContainerDom).append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                root = treeData;
                defs = svg.append('defs');
                //initArrowdefs
                initArrowDef();

                update(root);
                function update(source) {
                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);
                    // Normalize for fixed-depth.
                    nodes.forEach(function (d) { d.y = d.depth * 100; });
                    // Declare the nodes�
                    var node = svg.selectAll("g.node")
                        .data(nodes, function (d) { return d.id || (d.id = ++i); });
                    // Enter the nodes.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function (d) {
                            return "translate(" + source.x0 + "," + source.y0 + ")";
                        }).on("click", nodeclick);
						
					console.log(source.children+"-"+source._children);	
                    nodeEnter.append("circle")
                     .attr("r", 10)
                        .attr("stroke", function (d, i) { console.log(d.name+"-"+i); return d.children || d._children ? "steelblue" : "#00c13f"; })
                        .style("fill", function (d) { return d.children || d._children ? "lightsteelblue" : "#fff"; });
                    //.attr("r", 10)
                    //.style("fill", "#fff");
                    nodeEnter.append("text")
                        .attr("y", function (d) {
                            return d.children || d._children ? -38 : 38;
                        })
                        .attr("dy", ".15em")
                        .attr("text-anchor", "middle")
                        .text(function (d) { return d.name; })
                        .style("fill-opacity", 1e-6);
                    // Transition nodes to their new position.
                    //horizontal tree
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
                    nodeUpdate.select("circle")
                        .attr("r", 3)
						.attr("stroke", function (d, i) { /* console.log(d.name+"-"+i); */ return d.children || d._children ? "steelblue" : "#00c13f"; })
                        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });
                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);


                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
                        .remove();
                    nodeExit.select("circle")
                        .attr("r", 1e-6);
                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);
                    // Update the links�
                    // Declare the links�
                    var link = svg.selectAll("path.link")
                        .data(links, function (d) { return d.target.id; });

                        var animSnD;
                    // Enter the links.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr('marker-start',  function(d) { console.log(d.target.direction) ;return linkMarkerStart(d.target.direction, false); })
                        .attr('marker-end',  function(d) { console.log(d.target.direction) ; return linkMarkerEnd(d.target.direction, false); })
                        .attr("d", function (d) {
                            var o = { x: source.x0, y: source.y0 };
                            return diagonal({ source: o, target: o });
                            
                        });
                        

                        function pathTween(path){
                            var length = path.node().getTotalLength(); // Get the length of the path
                            var r = d3.interpolate(0, length); //Set up interpolation from 0 to the path length
                            return function(t){
                                var point = path.node().getPointAtLength(r(t)); // Get the next point along the path
                                d3.select(this) // Select the circle
                                    .attr("cx", point.x) // Set the cx
                                    .attr("cy", point.y) // Set the cy
                            }
                        }
                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                    .attr("d", diagonal);
                        

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function (d) {
                            var o = { x: source.x, y: source.y };
                            return diagonal({ source: o, target: o });
                        })
                        .remove();
                        var animcircle;

                       
                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                        console.log(d.x+"=============="+d.y+"+++++++++++"+d.name);
                    });

                    

                    $("#animate").click(function(){
                        link.each(function(d, i) {

                            
    
                            console.log("->"+d.source.name+"=>"+d.target.name);
                            if(d.target.name==="Application1") {
                                console.log((d.source.x)+"===>"+(d.source.y));
                                var datacircle = svg.append("circle")
                                .attr("cx", d.source.x) //Starting x
                                .attr("cy", d.source.y) //Starting y
                                .attr("r", 5)
                                .style("fill", "red")
                                .transition()
                                .delay(250)
                                .duration(1000)
                                .ease("linear")
                                .tween("pathTween", function(){return pathTween(link)}); 
                                
                                datacircle.remove();
    
                            }
    
                            
                        });
                    }); 

                }
				var val=0;
                // Toggle children on click.
                function nodeclick(d) {
					
					//console.log(JSON.stringify(treeData));
					
                    var name ="test"+val++;
                    
                    var direction = (val%2) ? "UP" : "NONE";

					var newNode = { 'name': name, 
                             'depth': d.depth + 1,                           
                             'children': [], 
                             '_children':null,
                             "direction" :  direction
                           };
                	
					
					if (d._children != null)  {
                        d.children = d._children;
                        d._children = null;
                }
                if (d.children == null) {
                        d.children = [];
                }
					d.children.push(newNode);
                   /* if (d.children) {
                        
						console.log("first");
						//d._children = d.children;
						d.children.push(newNode);
                        //d.children = null;
                    } else {
						
						console.log("second"+d._children);
                        //d.children = d._children;
						d.children = [];
						d.children.push(newNode);
                        //d._children = null;
                    }*/
					
					//console.log('Create Node name: ' + name);
					//console.log('Create Node name: ' + d.direction + "   "+ d._children);
					
					//Push it to parent.children array  
					  //d.children.push(newNode);
					  //d.data.children.push(newNode.data);
					
                    update(d);
                }
            }

            var treeData =
			
			/* {
				"name": "ROOT",
				"children": []
			}; */
        {
            "name": "ROOT",
            "direction" : "DOWN",
            "children": [
              {
                  "name": "IOTUnit-1",
                  "direction" : "UP",
                  "children": [
                    {
                        "name": "Application1",
                        "direction" : "UP",
                         "children": []
                    },
                    {
                        "name": "Application2",
                        "direction" : "NONE",
                        "children": []
                    }
                  ]
              },
              {
                  "name": "IOTUnit-2",
                  "children": [],
                  "direction" : "NONE"
              }
            ]
        };
            BuildVerticaLTree(treeData, "#tree");
        });

        function initArrowDef() {
            // Build the arrows definitions
            // End arrow
            defs.append('marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .attr('class', 'arrow')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5');
    
            // End arrow selected
            defs.append('marker')
            .attr('id', 'end-arrow-selected')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .attr('class', 'arrowselected')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5');
    
            // Start arrow
            defs.append('marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .attr('class', 'arrow')
            .append('path')
            .attr('d', 'M10,-5L0,0L10,5');
    
            // Start arrow selected
            defs.append('marker')
            .attr('id', 'start-arrow-selected')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .attr('class', 'arrowselected')
            .append('path')
            .attr('d', 'M10,-5L0,0L10,5');
        }

        function linkMarkerStart(direction, isSelected) {
			if (direction == 'UP')
			{
				return isSelected ? 'url(#start-arrow-selected)' : 'url(#start-arrow)';
			}
			return '';
        }
        
        function linkMarkerEnd(direction, isSelected) {
			if (direction == 'DOWN')
			{
				return isSelected ? 'url(#end-arrow-selected)' : 'url(#end-arrow)';
			}
			return '';
		}