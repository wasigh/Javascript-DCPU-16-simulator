function screen(startAddress, rows, cols)
{
	this.startAddress = startAddress;
	this.rows = rows;
	this.cols = cols;
	
}



screen.prototype.update = function (aCpu)
{
	currentAddress = this.startAddress;
	for (i = 0; i < this.rows; i++) {
		for (j = 0; j < this.cols; j++) {
			if(aCpu.ram[currentAddress])
			{
				char = String.fromCharCode(aCpu.ram[currentAddress]);
				$("#" + currentAddress).text(char);
			}
			currentAddress++;
		}
	}
}

screen.prototype.init = function(baseElement)
{
	currentAddress = this.startAddress;
	$table = $("<table>");
	$table.attr("id", "cpu-screen")
	for (i = 0; i < this.rows; i++)
	{
		$tr = $("<tr>");
		for (j = 0; j < this.cols;j++)
		{
			$td = $("<td>")
			$td.attr("id", currentAddress++);
			//$td.text('A');
			$tr.append($td);
		}
		$table.append($tr);
	}
	
	$(baseElement).append($table);
}
