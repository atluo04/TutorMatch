import os
import subprocess
import sys


def file_exists(directory, filename):
    file_path = os.path.join(directory, filename)
    return os.path.isfile(file_path)


backend_path = os.path.join(os.getcwd(), "tutormatch", "backend")
frontend_path = os.path.join(os.getcwd(), "tutormatch", "frontend")


if not file_exists(backend_path, ".env"):
    # If the file doesn't exist, prompt the user for API keys
    firebase_api_key = input("Enter Firebase API Key: ")
    algolia_post_api_key = input("Enter Algolia Post API Key: ")
    algolia_user_api_key = input("Enter Algolia User API Key: ")
    with open(os.path.join(backend_path, ".env"), "w") as file:
        file.write(f"FIREBASE_API_KEY='{firebase_api_key}'\n")
        file.write(f"ALGOLIA_POST_API_KEY='{algolia_post_api_key}'\n")
        file.write(f"ALGOLIA_USER_API_KEY='{algolia_user_api_key}'\n")

        file.write(f"FIREBASE_AUTH_DOMAIN='tutormatch-789d9.firebaseapp.com'\n")
        file.write(f"FIREBASE_PROJECT_ID='tutormatch-789d9'\n")
        file.write(f"FIREBASE_STORAGE_BUCKET='tutormatch-789d9.appspot.com'\n")
        file.write(f"FIREBASE_MESSAGING_SENDER_ID='956855862545'\n")
        file.write(f"FIREBASE_APP_ID='1:956855862545:web:e5f1b79a82ce1c45c138b0'\n")
        file.write(f"FIREBASE_MEASUREMENT_ID='G-V25ZNBDNCD'\n")

        file.write(f"ALGOLIA_APP_ID='R7E5FEZGEQ'\n")

processes = []

try: 
    os.chdir(backend_path)
    subprocess.run("npm install", shell=True, check=True)
    processes.append(subprocess.Popen("npm start", shell=True))
    os.chdir("..")

    os.chdir(frontend_path)
    subprocess.run("npm install", shell=True, check=True)
    processes.append(subprocess.Popen("npm start", shell=True))
    os.chdir("..")

    while any(process.poll() is None for process in processes):
        pass
        
except KeyboardInterrupt:
    print("Terminating processes.")
    for process in processes:
        try:
            process.terminate()
        except ProcessLookupError:
            pass
    sys.exit(0)

print("Script completed.")
sys.exit(0)
