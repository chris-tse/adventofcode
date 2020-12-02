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

	pub fn from(entry: &str) -> Entry {
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
