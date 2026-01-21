"""Compound interest calculator."""


def calculate_compound_interest(principal, rate, time, compounds_per_year=12, monthly_contribution=0):
    """
    Calculate compound interest with optional monthly contributions.

    Args:
        principal: Initial investment amount
        rate: Annual interest rate (as decimal, e.g., 0.05 for 5%)
        time: Time period in years
        compounds_per_year: Number of times interest compounds per year (default: 12)
        monthly_contribution: Amount contributed each month (default: 0)

    Returns:
        Tuple of (final_amount, total_contributions, interest_earned)
    """
    # Future value of principal
    fv_principal = principal * (1 + rate / compounds_per_year) ** (compounds_per_year * time)

    # Future value of monthly contributions (annuity)
    if monthly_contribution > 0 and rate > 0:
        monthly_rate = rate / 12
        total_months = int(time * 12)
        fv_contributions = monthly_contribution * (((1 + monthly_rate) ** total_months - 1) / monthly_rate)
    else:
        fv_contributions = monthly_contribution * time * 12

    final_amount = fv_principal + fv_contributions
    total_contributions = principal + (monthly_contribution * time * 12)
    interest_earned = final_amount - total_contributions

    return final_amount, total_contributions, interest_earned


def print_yearly_breakdown(principal, rate, years, compounds_per_year, monthly_contribution=0):
    """Print a year-by-year breakdown table."""
    print(f"\n{'Year':<6} {'Balance':>14} {'Contributions':>14} {'Interest':>12} {'Total Interest':>16}")
    print("-" * 66)

    total_interest = 0
    yearly_contribution = monthly_contribution * 12

    for year in range(1, years + 1):
        balance, total_contrib, _ = calculate_compound_interest(
            principal, rate, year, compounds_per_year, monthly_contribution
        )
        prev_balance, prev_contrib, _ = calculate_compound_interest(
            principal, rate, year - 1, compounds_per_year, monthly_contribution
        ) if year > 1 else (principal, principal, 0)

        year_contrib = total_contrib - prev_contrib
        year_interest = balance - prev_balance - year_contrib
        total_interest += year_interest

        print(f"{year:<6} ${balance:>12,.2f} ${year_contrib:>12,.2f} ${year_interest:>10,.2f} ${total_interest:>14,.2f}")



def main():
    print("=== Compound Interest Calculator ===\n")

    principal = float(input("Enter principal amount: $"))
    monthly_contribution = float(input("Enter monthly contribution: $"))
    rate = float(input("Enter annual interest rate (e.g., 5 for 5%): ")) / 100
    time = int(input("Enter time period in years: "))
    compounds_per_year = int(input("Enter compounds per year (12 for monthly, 4 for quarterly): "))

    final_amount, total_contributions, interest_earned = calculate_compound_interest(
        principal, rate, time, compounds_per_year, monthly_contribution
    )

    print(f"\nResults:")
    print(f"  Principal:           ${principal:,.2f}")
    print(f"  Monthly Contribution:${monthly_contribution:,.2f}")
    print(f"  Interest Rate:       {rate * 100:.2f}%")
    print(f"  Time:                {time} years")
    print(f"  Compounds/Year:      {compounds_per_year}")
    print(f"  ---")
    print(f"  Total Contributions: ${total_contributions:,.2f}")
    print(f"  Interest Earned:     ${interest_earned:,.2f}")
    print(f"  Final Amount:        ${final_amount:,.2f}")

    print_yearly_breakdown(principal, rate, time, compounds_per_year, monthly_contribution)


if __name__ == "__main__":
    main()
