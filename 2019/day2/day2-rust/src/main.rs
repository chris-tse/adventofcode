use std::collections::HashMap;
use std::fs::File;
use std::io;
use std::io::prelude::*;

fn main() -> io::Result<()> {
	let mut f = File::open("input")?;
	let mut buffer = String::new();

	f.read_to_string(&mut buffer)?;

	let original_memory: Vec<u32> = buffer
		.split(',')
		.map(|item| item.parse::<u32>().unwrap())
		.collect();

	let mut instructions: HashMap<u32, Box<dyn Fn(u32, u32, u32, &mut [u32]) -> ()>> =
		HashMap::new();

	instructions.insert(1, Box::new(&addition));
	instructions.insert(2, Box::new(&multiplication));

	let mut memory: Vec<u32> = original_memory.clone();

	exec_program(12, 2, memory.as_mut_slice(), &instructions);

	println!("Part 1: {}", memory[0]);

	for noun in 0..100 {
		for verb in 0..100 {
			let mut memory: Vec<u32> = original_memory.clone();

			exec_program(noun, verb, memory.as_mut_slice(), &instructions);

			if memory[0] == 19690720 {
				println!("Part 2");
				println!("Noun: {}, Verb: {}", noun, verb);
				println!("100 * {} + {} = {}", noun, verb, 100 * noun + verb);
				::std::process::exit(0);
			}
		}
	}

	Ok(())
}

pub fn exec_program(
	noun: u32,
	verb: u32,
	memory: &mut [u32],
	instructions: &HashMap<u32, Box<dyn Fn(u32, u32, u32, &mut [u32]) -> ()>>,
) {
	memory[1] = noun;
	memory[2] = verb;

	let mut curr_pos = 0;

	while memory[curr_pos] != 99 {
		let opcode = memory[curr_pos];
		let arg1_pos = memory[curr_pos + 1];
		let arg2_pos = memory[curr_pos + 2];
		let dest_pos = memory[curr_pos + 3];

		match instructions.get(&opcode) {
			Some(function) => function(arg1_pos, arg2_pos, dest_pos, memory),
			None => println!("Invalid opcode"),
		}

		curr_pos += 4;
	}
}

pub fn addition(arg1_pos: u32, arg2_pos: u32, dest_pos: u32, memory: &mut [u32]) {
	let arg1_pos = arg1_pos as usize;
	let arg2_pos = arg2_pos as usize;
	let dest_pos = dest_pos as usize;
	memory[dest_pos] = memory[arg1_pos] + memory[arg2_pos];
}

pub fn multiplication(arg1_pos: u32, arg2_pos: u32, dest_pos: u32, memory: &mut [u32]) {
	let arg1_pos = arg1_pos as usize;
	let arg2_pos = arg2_pos as usize;
	let dest_pos = dest_pos as usize;
	memory[dest_pos] = memory[arg1_pos] * memory[arg2_pos];
}
