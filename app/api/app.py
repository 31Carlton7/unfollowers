import os
import tempfile
import subprocess
import unfollowers
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/callUnfollowersScript', methods=['POST'])
def call_unfollowers_script():
    try:
        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No zip file uploaded"}), 400

        file = request.files['file']

        # Check if the filename is empty
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        # Execute the Python script
        result = unfollowers.getUnfollowers(temp_file_path)

        # Clean up the temporary file
        os.unlink(temp_file_path)

        return jsonify(result)

    except subprocess.CalledProcessError as e:
        print('Subprocess error:', e)
        return jsonify({"error": "Error processing zip file"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)