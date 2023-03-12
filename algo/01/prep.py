input = open('IntegerArray.txt', 'r')

output = open('input.js','w')

output.write('input = [')



for line in input:
    print(line)
    output.write(line + ',')

output.write('];')

input.close()
output.close()