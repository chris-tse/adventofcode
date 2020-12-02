use std::fs;

#[derive(Debug)]
struct Entry {
	password: String,
	target_letter: char,
	min: usize,
	max: usize,
}

impl Entry {
	fn is_valid(&self) -> bool {
		let mut target_count = 0;

		for letter in self.password.chars() {
			if letter == self.target_letter {
				target_count += 1;

				if target_count > self.max {
					return false;
				}
			}
		}

		return self.min <= target_count && target_count <= self.max;
	}

	fn is_valid_part_2(&self) -> bool {
		let (pos1, pos2) = (self.min - 1, self.max - 1);

		return (self.password.chars().nth(pos1).unwrap() == self.target_letter)
			^ (self.password.chars().nth(pos2).unwrap() == self.target_letter);
	}
}

fn main() {
	let file_contents = fs::read_to_string("input").expect("Something went wrong");

	let entries: Vec<&str> = file_contents.split("\n").collect();

	part1(entries.clone());
	part2(entries.clone());
}

fn part1(entries: Vec<&str>) {
	let mut num_valid_passwords = 0;

	for e in entries {
		let entry = split_entry(e);
		if entry.is_valid() {
			num_valid_passwords += 1;
		}
	}

	println!("There are {} valid passwords", num_valid_passwords);
}

fn part2(entries: Vec<&str>) {
	let mut num_valid_passwords = 0;

	for e in entries {
		let entry = split_entry(e);
		if entry.is_valid_part_2() {
			num_valid_passwords += 1;
		}
	}

	println!("There are {} valid passwords", num_valid_passwords);
}

/// Splits an entry into useful parts
fn split_entry(entry: &str) -> Entry {
	let split_res: Vec<&str> = entry.split(": ").collect();
	let (policy, password) = (split_res[0], String::from(split_res[1]));

	let split_policy: Vec<&str> = policy.split(" ").collect();
	let (range, target_letter) = (split_policy[0], split_policy[1].chars().nth(0).unwrap());

	let range_split: Vec<usize> = range
		.split("-")
		.map(|s| s.parse::<usize>().unwrap())
		.collect();
	let (min, max) = (range_split[0], range_split[1]);

	return Entry {
		password,
		target_letter,
		min,
		max,
	};
}
