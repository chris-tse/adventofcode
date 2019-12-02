use std::error::Error;
use std::fs::File;
use std::io::{prelude::*, BufReader};
use std::path::Path;

fn main() {
	let path = Path::new("input");
	let display = path.display();

	let file = match File::open(&path) {
		Err(why) => panic!("couldn't open {}: {}", display, why.description()),

		Ok(file) => file,
	};

	let reader = BufReader::new(file);

	let mut part1_sum = 0;
	let mut part2_sum = 0;

	for line in reader.lines() {
		let input: i32 = line.unwrap().parse().unwrap();

		let fuel = get_fuel_by_mass(input);
		let recfuel = recursive_get_fuel_by_mass(input, 0);

		part1_sum += fuel;
		part2_sum += recfuel;
	}

	println!("Part 1: {}", part1_sum);
	println!("Part 2: {}", part2_sum);
}

pub fn get_fuel_by_mass(mass: i32) -> i32 {
	let mass: f64 = mass as f64;
	let fuel = (mass / 3.0).floor() - 2.0;
	return fuel as i32;
}

pub fn recursive_get_fuel_by_mass(mass: i32, sum: i32) -> i32 {
	let fuel = get_fuel_by_mass(mass);

	if fuel > 0 {
		return recursive_get_fuel_by_mass(fuel, sum + fuel);
	} else {
		return sum;
	}
}
