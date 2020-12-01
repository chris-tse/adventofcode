use std::collections::HashSet;
use std::fs;

fn main() {
	let file_contents = fs::read_to_string("input").expect("Something went wrong");
	let expenses: Vec<i32> = file_contents
		.split("\n")
		.map(|s| s.parse::<i32>().unwrap())
		.collect();
	let target = 2020;

	part1(expenses.clone(), target);
	part2(expenses.clone(), target);
}

fn part1(expenses: Vec<i32>, target: i32) {
	println!("Part 1:");
	let mut history: HashSet<i32> = HashSet::new();

	for current in expenses {
		let needed = target - current;

		if !history.contains(&needed) {
			history.insert(current);
		} else {
			println!("Needed pair: {}, {}", current, needed);
			println!("Product: {}", current * needed);
		}
	}
}

fn part2(expenses: Vec<i32>, target: i32) {
	println!("Part 2:");

	for i in 0..expenses.len() {
		let outer_current = expenses[i];
		let mut history: HashSet<i32> = HashSet::new();
		let needed = target - outer_current;

		for j in i..expenses.len() {
			let inner_current = expenses[j];
			if !history.contains(&(needed - inner_current)) {
				history.insert(inner_current);
			} else {
				println!(
					"Needed triplet: {} {} {}",
					outer_current,
					inner_current,
					needed - inner_current
				);
				println!(
					"Product: {}",
					outer_current * inner_current * (needed - inner_current)
				);
			}
		}
	}
}
