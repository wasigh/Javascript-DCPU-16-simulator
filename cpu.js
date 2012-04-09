// Implementation of 0x10C cpu, thanks to: evilpie https://gist.github.com/2300590

function cpu(){
	this.regA = 0;
	this.regB = 0;
	this.regC = 0;
	this.regX = 0;
	this.regY = 0;
	this.regZ = 0;
	this.regI = 0;
	this.regJ = 0;
	
	this.opSET = 1;
	this.opADD = 2;
	this.opSUB = 3;
	this.opMUL = 4;
	this.opDIV = 5;
	this.opMOD = 6
	this.opSHL = 7;
	this.opSHR = 8;
	this.opAND = 9;
	this.opBOR = 10;
	this.opXOR = 11;
	this.opIFE = 12;
	this.opIFN = 13;
	this.opIFG = 14;
	this.opIFB = 15;
	
	this.pc = 0;
	this.sp = 0xffff + 1;
	this.o = 0;
	
	this.ram = new Array(10000);
	
	this.program = [];
	
	this.basic_op = ['SET', 'ADD', 'SUB', 'MUL', 'DIV', 'MOD', 'SHL', 'SHR', 'AND', 'BOR', 
					'XOR', 'IFE', 'IFN', 'IFG', 'IFB'];
					
					
	this.keyboardBuffer = "";
	this.keyboardMemAddress = 0x9000;
	
	if (!this.ram[this.keyboardMemAddress])
		this.ram[this.keyboardMemAddress] = 0;
					
					
	
}

function hex(n) 
{
	return n.toString(16);
}

cpu.prototype.readRegisterValue = function(bits)
{
	if (bits == 0)
		return this.regA;
	if (bits == 1)
		return this.regB;
	if (bits == 2)
		return this.regC;
	if (bits == 3)
		return this.regX;
	if (bits == 4)
		return this.regY;
	if (bits == 5)
		return this.regZ;
	if (bits == 6)
		return this.regI;
	if (bits == 7)
		return this.regJ;
		
	else // not really an option 
		return  -1;	
		
		
}


cpu.prototype.writeRegisterValue = function(bits, value)
{
	if (bits == 0)
		 this.regA = value;
	if (bits == 1)
		this.regB = value;
	if (bits == 2)
		this.regC = value;
	if (bits == 3)
		this.regX = value;
	if (bits == 4)
		this.regY = value;
	if (bits == 5)
		this.regZ = value;
	if (bits == 6)
		this.regI = value;
	if (bits == 7)
		this.regJ = value;
		
	else // not really an option 
		return  -1;	
}

cpu.prototype.readValue = function (bits) {
		//var reg_names = ['A', 'B', 'C', 'X', 'Y', 'Z', 'I', 'J'];

		if (bits <= 0x07) {
			return this.readRegisterValue(bits);
		}
		if (bits <= 0x0f) {
			var regValue = this.readRegisterValue(bits - 0x08);
			return this.ram[regValue];
		}
		if (bits <= 0x17) {
			var regValue = this.readRegisterValue(bits - 0x10);
			return this.program[++this.pc] + this.ram[regValue];
		}
		switch (bits) {
			case 0x18: //pop
				return this.ram[this.sp++];
			case 0x19: // peep
				return this.ram[this.sp];
			case 0x1a: // push
			    if (this.sp == -1)
					this.sp = 0xffff;
					
				return this.ram[-- this.sp];	
				
			case 0x1b:
				return this.sp
			case 0x1c:
				return this.pc
			case 0x1d:
				return this.o;
			case 0x1e:
				return this.ram[this.program[++this.pc]];
			case 0x1f:
				/* literal */
				return this.program[++this.pc]
		}
		/* literal */
		return (bits - 0x20);
	}
	
	cpu.prototype.readTargetValue = function (bits) {
		//var reg_names = ['A', 'B', 'C', 'X', 'Y', 'Z', 'I', 'J'];

		// FIXME: refactor
		if (bits <= 0x07) {
			return bits
		}
		if (bits <= 0x0f) {
			return bits;
		}
		if (bits <= 0x17) {
			return bits
		}
		switch (bits) {
			case 0x18:
			case 0x19:
			case 0x1a:
			case 0x1b:
			case 0x1c:
			case 0x1d:
				return bits;
			case 0x1e:
				return this.program[++this.pc];
			case 0x1f:
				/* literal */
				return this.program[++this.pc]
		}
		/* literal */
		return (bits - 0x20);
	}


cpu.prototype.writeValue = function (bits, value) {
		//var reg_names = ['A', 'B', 'C', 'X', 'Y', 'Z', 'I', 'J'];
		value = value & 0xFFFF;


		if (bits <= 0x07) 
		{
			this.writeRegisterValue(bits, value);
		}
		else if (bits <= 0x0f) 
		{
				var regValue = this.readRegisterValue(bits - 0x08);
				this.ram[regValue] = value;
		}
		else if (bits <= 0x17) 
		{
					//var regValue = this.readRegisterValue(bits - 0x10);
					//return this.program[++this.pc] + this.ram[regValue];
					1 / 0;
		}
		else if (bits <= 0x1f) 
		{
			switch (bits)
			{
				case 0x18: // POP
					this.ram[this.sp ++] = value;	
					break;
					return 'POP';
				case 0x19: // PEEK
					this.ram[ this.sp] = value;	
					break;
				case 0x1a: // PUSH
					this.ram[-- this.sp] = value;	
					break;
				case 0x1b:
					this.sp = value;
					break;
				case 0x1c:
					this.pc = value - 1; // pc++ is done after step...
					break;
				case 0x1d:
					this.o = value;
					break;
				case 0x1e:
					this.ram[this.program[++this.pc]] = value;
					break;
				case 0x1f:
					/* literal */
					this.program[++this.pc] = value;
					break;
			}
		}
		else
		{
			/* literal */ 
			this.ram[bits] = value;
		}
		
	}


cpu.prototype.operand = function (bits) {
		var reg_names = ['A', 'B', 'C', 'X', 'Y', 'Z', 'I', 'J'];

		if (bits <= 0x07) {
			return reg_names[bits];
		}
		if (bits <= 0x0f) {
			return '[' + reg_names[bits - 0x08] + ']';
		}
		if (bits <= 0x17) {
			return '[' + hex(this.program[++this.pc]) + ' + ' + reg_names[bits - 0x10] + ']';
		}
		switch (bits) {
			case 0x18:
				return 'POP';
			case 0x19:
				return 'PEEK';
			case 0x1a:
				return 'PUSH';
			case 0x1b:
				return 'SP';
			case 0x1c:
				return 'PC';
			case 0x1d:
				return 'O';
			case 0x1e:
				return '[' + hex(this.program[++this.pc]) + ']';
			case 0x1f:
				/* literal */
				return hex(this.program[++this.pc]);
		}
		/* literal */
		return hex(bits - 0x20);
	}



cpu.prototype.loadProgram = function(program)
{
	this.program = program.split(" ");
	for (i = 0; i < this.program.length; i++)
	{
		this.program[i] = parseInt("0X" + this.program[i], 16); 
	}
};

cpu.prototype.run = function()
{
	while (this.pc < this.program.length)
	{
		this.step();
	}
};

cpu.prototype.handleBasicOp= function(op, a, b)
{
	if (op == this.opSET) // set
		this.handleSetOp(a, b);
	if (op == this.opADD)
		this.handleAddOp(a,b);
	if (op == this.opSUB)
		this.handleSubOp(a,b); 
	if (op == this.opMUL)
		this.handleMulOp(a,b);		
	if (op == this.opDIV)
		this.handleDivOp(a,b);
	if (op == this.opMOD)	
		this.handleModOp(a,b);
	if (op == this.opSHL)
		this.handleShlOp(a,b);	
	if (op == this.opSHR)
		this.handleShrOp(a,b);
	if (op == this.opAND)
		this.handleAndOp(a,b);
	if (op == this.opBOR)
		this.handleBorOp(a,b);	
	if (op == this.opXOR)
		this.handleXorOp(a,b);
	if (op == this.opIFE)
		this.handleIfeOp(a,b);			
	if (op == this.opIFN)
		this.handleIfnOp(a,b);
	if (op == this.opIFG)
		this.handleIfgOp(a,b);
	if (op == this.opIFB)
		this.handleIfbOp(a,b);	
}

cpu.prototype.handleSetOp = function(a, b)
{
	var aValue = this.readTargetValue(a);
	
	var bValue = this.readValue(b);
	this.writeValue(aValue,bValue);
}

// ADD a, b - sets a to a+b, sets O to 0x0001 if there's an overflow, 0x0 otherwise
cpu.prototype.handleAddOp = function(a, b)
{
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	result = aValue + bValue;
	if (result > 0xffff)
	{
		this.o = 0x0001;	
	}
	else
	{
		this.o = 0x0;
	}
	this.writeValue(a,result);
}

//SUB a, b - sets a to a-b, sets O to 0xffff if there's an underflow, 0x0 otherwise
cpu.prototype.handleSubOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue - bValue;
	if (result < 0)
		this.o = 0xffff;
	else
		this.o = 0;
	this.writeValue(a,result);
}

//MUL a, b - sets a to a*b, sets O to ((a*b)>>16)&0xffff
cpu.prototype.handleMulOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue * bValue;
	var overflow = result >> 16 & 0xFFFF;
	this.writeValue(a,result);
	this.o = overflow;
}

// DIV a, b - sets a to a/b, sets O to ((a<<16)/b)&0xffff. if b==0, sets a and O to 0 instead.
cpu.prototype.handleDivOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	if (bValue == 0)
	{
		this.writeValue(a,0);
	    this.o = 0;
	}
	else
	{
		var result = aValue / bValue;
		var overflow = ((aValue << 16)/bValue)&0xffff;
		this.writeValue(a,result);
		this.o = overflow;
	}
	
	
}

// MOD a, b - sets a to a%b. if b==0, sets a to 0 instead.
cpu.prototype.handleModOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	if (bValue == 0)
	{
		this.writeValue(a,0);
	}
	else
	{
		var result = aValue % bValue;
		this.writeValue(a,result);
		
	}
	this.o = 0;
	
}

// SHL a, b - sets a to a<<b, sets O to ((a<<b)>>16)&0xffff
cpu.prototype.handleShlOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue << bValue;
	this.writeValue(a,result);
	
	this.o = ((aValue<<bValue)>>16)&0xffff 
	
}


// SHR a, b - sets a to a>>b, sets O to ((a<<16)>>b)&0xffff
cpu.prototype.handleShrOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue >> bValue;
	this.writeValue(a,result);
	
	this.o = ((aValue<<16)>>bValue)&0xffff 
	
}
// AND a, b - sets a to a&b
cpu.prototype.handleAndOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue & bValue;
	this.writeValue(a,result);
	
}

// BOR a, b - sets a to a|b
cpu.prototype.handleBorOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue | bValue;
	this.writeValue(a,result);
	
}

// XOR a, b - sets a to a^b
cpu.prototype.handleXorOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	var result = aValue ^ bValue;
	this.writeValue(a,result);
	
}
// IFE a, b - performs next instruction only if a==b
cpu.prototype.handleIfeOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	if (aValue != bValue)
		this.ignoreNextStep();
}


// IFN a, b - performs next instruction only if a!=b
cpu.prototype.handleIfnOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	if (aValue == bValue)
		this.ignoreNextStep();
}

// IFG a, b - performs next instruction only if a>b
cpu.prototype.handleIfgOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	if (!(aValue > bValue))
		this.ignoreNextStep();
}

// IFB a, b - performs next instruction only if (a&b)!=0
cpu.prototype.handleIfbOp = function(a, b)
{
	//var aTargetValue = this.readTargetValue(a);
	var aValue = this.readValue(a);
	var bValue = this.readValue(b);
	
	if ((aValue & bValue) == 0)
		this.ignoreNextStep();
}

cpu.prototype.ignoreNextStep = function()
{
	var inst = this.program[++this.pc];

	if ((inst & 0xf) == 0) {
		/* non basic */
		if (((inst >> 4) & 0x3f) == 0x01) {
			console.log('JSR ' + this.operand(inst >> 10))
		}
	} else 
	{
		var operand = inst & 0xf;
		var a = (inst >> 4) & 0x3f;
		var b = inst >> 10;
		
		var pc = this.pc;
		var line = "IGNORED:" + this.basic_op[operand - 1] + ' ' + this.operand(a) + ', ' + this.operand(b);
		if (console)
			console.log(line);
		if (this.linePrinter)
			this.linePrinter(pc, line);
		//this.pc = pc;
		//this.handleBasicOp(operand, a, b);
	}
	//this.pc++;
	
	
	if (this.debug != undefined)
		this.debug();
}

cpu.prototype.updateKeyMem = function(){
	// if keyboardMem == 0 && keyboardbuffer != ""
	// set keyboardMem to first char
	
	
	
	if (this.ram[this.keyboardMemAddress] == 0 && this.keyboardBuffer.length > 0)
	{
		this.ram[this.keyboardMemAddress] = this.keyboardBuffer.charCodeAt(0);
		kb = this.keyboardBuffer.substring(1);
		console.log("KB: " + kb );
		this.keyboardBuffer = kb;
	} 
}

cpu.prototype.step = function()
{
	
	this.updateKeyMem();
	var inst = this.program[this.pc];

	if ((inst & 0xf) == 0) {
		/* non basic */
		if (((inst >> 4) & 0x3f) == 0x01) {
			if (console)
				console.log('JSR ' + this.operand(inst >> 10))
		}
	} else 
	{
		var operand = inst & 0xf;
		var a = (inst >> 4) & 0x3f;
		var b = inst >> 10;
		
		var pc = this.pc;
		var line = this.basic_op[operand - 1] + ' ' + this.operand(a) + ', ' + this.operand(b)
		
		if (console)
			console.log(line);
		if (this.linePrinter)
			this.linePrinter(pc, line);
			
		this.pc = pc;
		this.handleBasicOp(operand, a, b);
	}
	this.pc++;
	
	
	if (this.debug != undefined)
		this.debug();
};
	
	



