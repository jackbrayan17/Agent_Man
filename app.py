from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid

app = Flask(__name__)
CORS(app)

# Config DB SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///agents.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modèle Agent
class Agent(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    telephone = db.Column(db.String(20), nullable=False)

# Créer la DB
with app.app_context():
    db.create_all()

@app.route('/api/agents', methods=['GET'])
def get_agents():
    agents = Agent.query.all()
    result = [{
        'id': agent.id,
        'nom': agent.nom,
        'prenom': agent.prenom,
        'email': agent.email,
        'telephone': agent.telephone
    } for agent in agents]
    return jsonify(result), 200

@app.route('/api/agents', methods=['POST'])
def add_agent():
    data = request.get_json()
    if not all(k in data for k in ("nom", "prenom", "email", "telephone")):
        return jsonify({"error": "Données manquantes"}), 400

    new_agent = Agent(
        id=str(uuid.uuid4()),
        nom=data['nom'],
        prenom=data['prenom'],
        email=data['email'],
        telephone=data['telephone']
    )
    db.session.add(new_agent)
    db.session.commit()

    return jsonify({"message": "Agent ajouté."}), 201

@app.route('/api/agents/<agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    agent = Agent.query.get(agent_id)
    if agent is None:
        return jsonify({"error": "Agent non trouvé"}), 404

    db.session.delete(agent)
    db.session.commit()

    return jsonify({"message": "Agent supprimé."}), 200

if __name__ == '__main__':
    app.run(debug=True)
