var w=window.screen.width,h=window.screen.height;
var svg=d3.select("body").append("svg").attr("class","svg").attr("width",w).attr("height",h)
var nodes,edges;
loadfile()
function loadfile(){
	d3.csv("data/nodes",function(error,data){
		if(error){
			console.log(error);
		}
		nodes=data;
		for(var i=0;i<nodes.length;++i){
				nodes[i].flow=parseInt(nodes[i].flow);
			}
		d3.csv("data/edges",function(error,dataset){
			if(error){
				console.log(error);
			}
			edges=dataset;
			for(var i=0;i<edges.length;++i){
				edges[i].source=parseInt(edges[i].source);
				edges[i].target=parseInt(edges[i].target);
				edges[i].size=parseInt(edges[i].size);
			}
			drawforce();
		})
	})
}
function drawforce(){
	var size_scale=d3.scale.linear()
		.domain([
			d3.min(nodes,function(d){
				if(d.type!="client"){
					return d.flow;
				}
				
			}),
			d3.max(nodes,function(d){
				return d.flow;
			})
		])
		.range([5,10])
	var width_scale=d3.scale.linear()
		.domain([
			d3.min(edges,function(d){
				return d.size;
			}),
			d3.max(edges,function(d){
				return d.size;
			})
		])
		.range([0.5,3])

	var force = d3.layout.force()
		.nodes(nodes)
		.links(edges)
		.size([w,h])
		.linkDistance(200)
		.charge([-100])
		.start();
				
	var drag=force.drag()
		.on("dragstart",function(d,i){
			d.fixed=true;
			//console.log("tuozhuai");
		})			
	var svg_edges = svg.selectAll("line")
		.data(edges)
		.enter()
		.append("line")
		.style("stroke","#3399ff")
		.style("opcaity",0.4)
		.style("stroke-width",function(d){
			return width_scale(d.size);
		});
	
	var color = d3.scale.category10();
						
	var svg_nodes = svg.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		.attr("r",function(d){
			if(d.type=="client"){
				return 5;
			}
			else{
				return size_scale(d.flow);
			}
		})
		.style("fill",function(d,i){
			if(d.type=="client"){
				return "#ccc";
			}
			return color(d.type);
		})
		.call(force.drag);
						
	force.on("tick", function(){
	
		 svg_edges.attr("x1",function(d){ return d.source.x; });
		 svg_edges.attr("y1",function(d){ return d.source.y; });
		 svg_edges.attr("x2",function(d){ return d.target.x; });
		 svg_edges.attr("y2",function(d){ return d.target.y; });
		 
		 svg_nodes.attr("cx",function(d){ return d.x; });
		 svg_nodes.attr("cy",function(d){ return d.y; });
	});
		  
}