extern crate regex;
use regex::Regex;

#[derive(Debug)]
pub struct Entry {
	password: String,
	target_letter: char,
	min: usize,
	max: usize,
}

impl Entry {
	pub fn create(password: String, target_letter: char, min: usize, max: usize) -> Entry {
		return Entry {
			password,
			target_letter,
			min,
			max,
		};
	}

	pub fn from(entry: &str, rg: &Regex) -> Entry {
		match rg.captures(entry) {
			Some(captures) => {
				return Entry {
					password: captures
						.name("password")
						.map(|m| String::from(m.as_str()))
						.unwrap(),
					target_letter: captures
						.name("target_letter")
						.map(|m| String::from(m.as_str()).chars().nth(0).unwrap())
						.unwrap(),
					min: captures
						.name("min")
						.map(|m| m.as_str().parse::<usize>().unwrap())
						.unwrap(),
					max: captures
						.name("max")
						.map(|m| m.as_str().parse::<usize>().unwrap())
						.unwrap(),
				};
			}
			None => unreachable!(),
		}
	}

	pub fn is_valid(&self) -> bool {
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

	pub fn is_valid_part_2(&self) -> bool {
		let (pos1, pos2) = (self.min - 1, self.max - 1);

		return (self.password.chars().nth(pos1).unwrap() == self.target_letter)
			^ (self.password.chars().nth(pos2).unwrap() == self.target_letter);
	}
}
