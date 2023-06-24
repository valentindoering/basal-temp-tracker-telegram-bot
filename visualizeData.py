import pandas as pd
import matplotlib.pyplot as plt
import sys

if __name__ == "__main__":
    input_file_name = sys.argv[1]
    output_file_name = sys.argv[2]

    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(input_file_name)

    # Extract the timestamp and temperature data from the DataFrame
    timestamp = df['n_days_since_1st_may']
    temperature = df['temperature']

    # print(timestamp)
    # print(temperature)

    # Plot the temperature data versus timestamp
    plt.plot(timestamp, temperature)

    # Add a title and axis labels
    plt.title('Temperature over Time')
    plt.xlabel('Timestamp')
    plt.ylabel('Temperature')

    # Show the plot
    plt.show()
    plt.savefig(output_file_name, dpi=300, bbox_inches='tight')

    # result = output_file_name

    # this is what the script returns
    print(output_file_name)