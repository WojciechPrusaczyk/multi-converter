import subprocess

def convert_image(input_file, output_file):
    subprocess.run(['magick', input_file, output_file], check=True)

def convert_video(input_file, output_file):
    subprocess.run(['ffmpeg', '-i', input_file, output_file], check=True)
