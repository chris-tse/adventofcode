use entry::Entry;
use std::fs;
mod entry;

fn main() {
	let file_contents = fs::read_to_string("input").expect("Something went wrong");

	let entries: Vec<&str> = file_contents.split("\n").collect();

	part1(entries.clone());
	part2(entries.clone());
}

fn part1(entries: Vec<&str>) {
	let mut num_valid_passwords = 0;

	for e in entries {
		let entry = Entry::from(e);
		if entry.is_valid() {
			num_valid_passwords += 1;
		}
	}

	println!("There are {} valid passwords", num_valid_passwords);
}

fn part2(entries: Vec<&str>) {
	let mut num_valid_passwords = 0;

	for e in entries {
		let entry = Entry::from(e);
		if entry.is_valid_part_2() {
			num_valid_passwords += 1;
		}
	}

	println!("There are {} valid passwords", num_valid_passwords);
}
