from flask_jwt_extended import jwt_required
import razorpay
from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/create-order', methods=['POST'])
@jwt_required()
def create_order():
    data = request.json
    amount = int(data.get('amount'))
    currency = data.get('currency')
    receipt = data.get('receipt')
    notes = data.get('notes', {})

    client = razorpay.Client(auth=(current_app.config['RAZORPAY_KEY'], current_app.config['RAZORPAY_SECRET']))
    order = client.order.create({
        'amount': amount*100,
        'currency': currency,
        'receipt': receipt,
        'notes': notes
    })

    # print(order)

    return jsonify(order), 200

@payment_bp.route('/capture-payment', methods=['POST'])
def capture_payment():
    data = request.json
    payment_id = data.get('payment_id')
    amount = data.get('amount')

    client = razorpay.Client(auth=(current_app.config['RAZORPAY_KEY'], current_app.config['RAZORPAY_SECRET']))
    payment = client.payment.capture(payment_id, amount)

    return jsonify(payment), 200








