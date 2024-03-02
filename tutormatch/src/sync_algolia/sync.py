import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from algoliasearch.search_client import SearchClient

# Install firebase-admin and algoliasearch
#
# In windows, I did something like, depends on your python location
# python.exe -m pip install firebase-admin
# python.exe -m pip install algoliasearch 
#
# need to change the path below!!!!
cred = credentials.Certificate('C:\Users\baby8\Desktop\TutorMatch\tutormatch\sync_algolia\Key.json')
firebase_admin.initialize_app(cred)

posts_client = SearchClient.create('R7E5FEZGEQ', 'dcb1af4231269f44fbfd224af6268aae')
posts_index = posts_client.init_index('posts')

users_client = SearchClient.create('R7E5FEZGEQ', '79b541af3529de1e1cb84f5df6d08c27')
users_index = users_client.init_index('users')

def import_data_to_algolia(collection_name, index, field_mapping):
    # Get Firestore collection reference
    db = firestore.client()
    docs = db.collection(collection_name).stream()

    # Initialize an empty batch
    batch = []
    
    # Iterate over each document in the collection
    for doc in docs:
        try:
            data = doc.to_dict()
            # Map Firestore fields to Algolia fields using the provided field mapping
            mapped_data = {field: data.get(field, '') for field in field_mapping}
            # Set the objectID field to the document ID
            mapped_data['objectID'] = doc.id
            batch.append(mapped_data)
        except Exception as e:
            print(f"Error processing document {doc.id}: {e}")

    # Save batch of objects to Algolia index
    index.save_objects(batch)

# Field mapping for the 'posts' collection
posts_field_mapping = [
    'content',
    'date',
    'image',
    'primaryCategory',
    'secondaryCategory',
    'title',
    'userId'
]

# Field mapping for the 'users' collection
users_field_mapping = [
    'Fullname',
    'Username',
    'Birthday',
    'Gender',
    'Majors',
    'Year',
    'profile_pic',
    'Phone',
    'Personal_mail',
    'Bio',
    'created_date',
    'Courses'
]

# Import data to 'posts' index
import_data_to_algolia('posts', posts_index, posts_field_mapping)

# Import data to 'users' index
import_data_to_algolia('users', users_index, users_field_mapping)

print("Batch import completed.")