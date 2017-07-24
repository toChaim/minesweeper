$(document).ready(function(){
	var $mines = $("#mines");
	var $board = $("#board");
	var playing = true;
	var protect = false;
	var mines = 0;

	var Cell = (function(){
		var idCount = 0;

		return function (c, r){
			this.id = "cell" + idCount++;
			this.col = c;
			this.row = r;
			this.$obj = $("<td>",{
				id: this.id,
				class: "cell",
				row: this.row,
				col: this.col,
			});
			var p = $("<p>", {text: this.id});
			this.$obj.append(p);
			this.mine = false;
			this.number = 0;
			this.setNumber = function(){
				if(this.mine){
					this.number = "Boom!";
				}else{
					for(let r = this.row - 1; r <= this.row + 1; r++){
						if(r < 0 || r > 9) continue;
						for(let c = this.col - 1; c <= this.col + 1; c++){
							if(c < 0 || c > 9) continue;
							if(cells[r][c].mine){ this.number++; }
						}
					}
				}
				this.$obj.children("p").text(this.number);
			};

			this.display = function(){
				this.$obj.addClass("show");
				this.$obj.removeClass("marked");
				if(this.mine){
					var $boom = $("<div>", {class: "boom"});
					$boom.append($("<p>", {text: "BOOM!!"}));
					this.$obj.children("p").append($boom);
				}else if(this.number === 0){
					this.$obj.addClass("show");
					for(let r = this.row - 1; r <= this.row + 1; r++){
						if(r < 0 || r > 9) continue;
						for(let c = this.col - 1; c <= this.col + 1; c++){
							if(c < 0 || c > 9) continue;
							if(r === this.row && c === this.col) continue;
							if(!cells[r][c].$obj.hasClass("show"))
								cells[r][c].display();
						}
					}
				}
			};
		}
	})();

	$('#reset').on('click', function(){
		playing = true;
		$('.boom').remove();
		$('.win').remove();
		$('.cell').removeClass('show marked mine');
		mines = 0;

		for(let row = 0; row < 10; row++){
			
			for(let col = 0; col < 10; col++){
				cells[row][col].mine = false;
				cells[row][col].number = 0;
			}
		}

		while(mines < 10){
			let row = Math.floor(Math.random()*10);
			let col = Math.floor(Math.random()*10);
			if(cells[row][col].mine === false){
				cells[row][col].mine = true;
				cells[row][col].$obj.addClass("mine");
				mines++;
			}
		}
		$mines.text(mines);

		for(let row = 0; row < 10; row++){
			
			for(let col = 0; col < 10; col++){
				cells[row][col].setNumber();
			}
		}

	});

	$("#protect").on("click", function(){
		protect = !protect;
		$("#protect").toggleClass("red");
	});

	$board.on('contextmenu', 'td', function(event){
		event.stopPropagation();
		var $this = $(this);
			$this.toggleClass('marked');
	});

	$board.on("click", "td" ,function(event){
		event.stopPropagation();
		if( !playing ) return;
		var $this = $(this);
		
		if($this.hasClass("cell") === false) return;
		if($this.hasClass("show")) return;

		var col = parseInt($this.attr("col"));
		var row = parseInt($this.attr("row"));
		var cell = cells[row][col];

		if(protect){
			$this.toggleClass("marked");
			$mines.text(mines - parseInt($(".marked").length));
			protect = false;
			$("#protect").toggleClass("red");
		}else if(!$this.hasClass("marked")){
			cells[row][col].display();
		}

		if($(".show").length + mines === 100){
			$board.append($("<h1>", {text: "YOU WIN !!!", class: "win"}));
			playing = false;
			console.log("YOU WIN!!!");
		}

	});

	var cells = [];
	for(let row = 0; row < 10; row++){
		var $row = $("<tr>");
		cells.push([]);

		for(let col = 0; col < 10; col++){
			var cell = new Cell(col, row);
			$row.append(cell.$obj);
			cells[row].push(cell);
		}

		$board.append($row);
	}

	while(mines < 10){
		let row = Math.floor(Math.random()*10);
		let col = Math.floor(Math.random()*10);
		if(cells[row][col].mine === false){
			cells[row][col].mine = true;
			cells[row][col].$obj.addClass("mine");
			mines++;
		}
	}
	$mines.text(mines);

	for(let row = 0; row < 10; row++){

		for(let col = 0; col < 10; col++){
			cells[row][col].setNumber();
		}
	}

});