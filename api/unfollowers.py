"""
This script extracts the contents of a zip file from the local file system and navigates to the target files.
It then reads the followers and following data from the files and returns a list of users who do not follow back.
    
Example:
    python script.py /path/to/zip/file.zip
    
Returns:
    A list of strings representing the users who do not follow back.
    
"""

import json
import zipfile
import os

def extract_and_navigate(zipPath):
    """
    Extracts the contents of a zip file from the local file system and navigates to the target files.

    Args:
        zipPath (str): The path to the zip file.

    Returns:
        List[str]: A list containing the paths to the followers and following files.

    Raises:
        FileNotFoundError: If the required files were not found in the extracted directory.
    """
    # Open the zip file from the local file system
    with zipfile.ZipFile(zipPath, 'r') as zip_ref:
        # Define the target directory to extract the contents
        extract_dir = os.path.splitext(zipPath)[0]
        # Extract the zip file
        zip_ref.extractall(extract_dir)

    # Define the paths to the target files
    followers_file = os.path.join(extract_dir, 'connections', 'followers_and_following', 'followers_1.json')
    following_file = os.path.join(extract_dir, 'connections', 'followers_and_following', 'following.json')

    # Ensure the target files exist
    if not os.path.exists(followers_file) or not os.path.exists(following_file):
        raise FileNotFoundError("The required files were not found in the extracted directory.")

    return [followers_file, following_file]

def getFollowers(followers):
    """
    Reads a JSON file containing a list of followers and returns a list of strings representing the values
    of the "value" key in each object.

    Parameters:
        followers (str): The path to the JSON file containing the followers data.

    Returns:
        List[str]: A list of strings representing the values of the "value" key in each object.
    """
    # Read the json file
    with open(followers) as f:
        data = json.load(f)
    # return a list of strings that come after the "value" key in each object
    return [follower['string_list_data'][0]['value'] for follower in data]

def getFollowing(following):
    """
    Reads a JSON file containing a list of followings and returns a list of strings representing the values
    of the "value" key in each object.

    Parameters:
        following (str): The path to the JSON file containing the followings data.

    Returns:
        List[str]: A list of strings representing the values of the "value" key in each object.
    """
    # Read the json file
    with open(following) as f:
        data = json.load(f)
    # Return a list of strings that come after the "value" key in each object
    return [following_data['string_list_data'][0]['value'] for following_data in data['relationships_following']]

def notFollowingBack(followers, following):
    """
    Given two lists of usernames, `followers` and `following`, this function returns a sorted list of usernames who are in the `following` list but not in the `followers` list.

    Parameters:
    - `followers` (List[str]): A list of usernames who are followers.
    - `following` (List[str]): A list of usernames who are being followed.

    Returns:
    - `notFollowingBackList` (List[str]): A sorted list of usernames who are in the `following` list but not in the `followers` list.
    """
    # Create a set of the followers
    followersSet = set(followers)
    # Create a set of the following
    followingSet = set(following)
    # Find the users who do not follow back
    notFollowingBack = followingSet.difference(followersSet)
    # Convert set to list
    notFollowingBackList = list(notFollowingBack)
    notFollowingBackList.sort()
    return notFollowingBackList

def extractZipAndReturnNotFollowingBack(zip):
    """
    Extracts a zip file, retrieves followers and following data, and returns a list of users who do not follow back.

    Parameters:
        zip (str): The path to the zip file containing the followers and following data.

    Returns:
        List[str]: A sorted list of strings representing the users who do not follow back.
    """
    files = extract_and_navigate(zip)
    followers = getFollowers(files[0])
    following = getFollowing(files[1])
    return notFollowingBack(followers, following)

def getUnfollowers(zip_path):
    """
    Extracts a zip file, retrieves followers and following data, and returns a list of users who do not follow back.

    Parameters:
        zip_path (str): The path to the zip file containing the followers and following data.

    Returns:
        List[str]: A sorted list of strings representing the users who do not follow back.
    """
    usernames = extractZipAndReturnNotFollowingBack(zip_path)
    return usernames

if __name__ == "__main__":
    import sys
    zip_path = sys.argv[1]
    try:
        print(json.dumps(getUnfollowers(zip_path)))
    except Exception as e:
        print(json.dumps({"error": str(e)}))