from pandas import read_csv, DataFrame
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import euclidean_distances
from joblib import dump, load
from flask import Flask, request
from os.path import isfile

CLUSTERS = 28
TRAIN_FILE = 'train.csv'
MODEL_FILE = 'model.pkl'

def trainmodel(trainFile, modelFile):
	df = read_csv(trainFile)
	mod = KMeans(n_clusters = CLUSTERS, n_init = 'auto', init = 'k-means++', random_state = 1).fit(df)
	dump(mod, modelFile)

def restoremodel(modelFile):
	mod = load(modelFile)
	return mod, euclidean_distances(mod.cluster_centers_)

def getfeatures(body):
	data = [body['age'],body['sex'],body['interests'],body['job'],body['bad_habits'],body['sociality']]

	age_group = (lambda x: x < 30 and 1 or x < 40 and 2 or x < 50 and 3 or 4)(data[0])
	sex_num = (lambda x: x == 'female' and 1 or x == 'male' and 2)(data[1])

	in1 = (lambda x: 'tech' in x and 1 or 0)(data[2])
	in2 = (lambda x: 'science' in x and 1 or 0)(data[2])
	in3 = (lambda x: 'sport' in x and 1 or 0)(data[2])
	in4 = (lambda x: 'art' in x and 1 or 0)(data[2])
	in5 = (lambda x: 'music' in x and 1 or 0)(data[2])
	in6 = (lambda x: 'politics' in x and 1 or 0)(data[2])

	job = (lambda x: x == 'computers' and 0 or x == 'education' and 1 or x == 'medicine' and 2 or x == 'foundry' and 3 or x == 'finance' and 4 or x == 'government' and 5)(data[3])

	bh1 = (lambda x: 'smoking' in x and 1 or 0)(data[4])
	bh2 = (lambda x: 'drinking' in x and 1 or 0)(data[4])

	soc = data[5]

	fmt = {
		'age':         [age_group],
		'sex':         [sex_num],
		'interest1':   [in1],
		'interest2':   [in2],
		'interest3':   [in3],
		'interest4':   [in4],
		'interest5':   [in5],
		'interest6':   [in6],
		'job':         [job],
		'bad_habits1': [bh1],
		'bad_habits2': [bh2],
		'sociality':   [soc]
	}

	df = DataFrame(fmt)

	return df

def getavgdist(origin, clusters):
	avg = 0.0
	for x in clusters:
		if x > CLUSTERS or x < 0 or origin < 0 or origin > CLUSTERS:
			return -1
		avg += dists[origin, x]
	return avg / len(clusters)

if not isfile(MODEL_FILE):
	trainmodel(TRAIN_FILE, MODEL_FILE)

mod, dists = restoremodel(MODEL_FILE)

app = Flask(__name__)

@app.post('/dist')
def getdist():
	body = request.get_json(force=True)
	userCluster = body['user']
	neighbours = body['neighbours']
	avg = getavgdist(userCluster, neighbours)
	if avg < 0:
		return {'error': "cluster doesn't exist."}
	return {'distance': float('{:.3f}'.format(avg))}

@app.post('/cluster')
def getcluster():
	X = getfeatures(request.get_json(force=True))
	return {'cluster': int(mod.predict(X)[0])}

app.run(host = '0.0.0.0')
