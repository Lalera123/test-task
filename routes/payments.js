const express = require('express');
const uuidv4 = require('uuid/v4');

const authMiddleware = require('../authMiddleware');

const Payment = require('../models').Payment;

const router = express.Router();

router.post('/', authMiddleware.verifyToken, async (req, res) => {
  const {
    payeeId,
    payerId,
    paymentSystem,
    paymentMethod,
    amount,
    currency,
    comment
  } = req.body;

  const createdPayment = await Payment.create({
    id: uuidv4(),
    payeeId,
    payerId,
    paymentSystem,
    paymentMethod,
    amount,
    currency,
    comment,
    status: 'created'
  })
    .then(res => JSON.parse(JSON.stringify(res)))
    .catch(err => {
      res.status(400).json({
        code: 'ERR_VALIDATION',
        message: 'Validation failed',
        details: err
      });
    });

  if (createdPayment) {
    res.status(201).json({
      ...createdPayment
    });
  }
});

router.get('/', authMiddleware.verifyToken, async (req, res) => {
  const payments = await Payment.findAndCountAll().then(res => JSON.parse(JSON.stringify(res)));

  res.status(200).json({
    data: payments.rows,
    count: payments.count
  });
});

router.get('/:id', authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findOne({
    where: { id }
  });

  if (!payment) {
    return res.status(404).json({
      code: 'ERR_NOT_FOUND',
      message: 'Payment not found'
    });
  }

  return res.status(200).json(payment);
});

router.put('/:id/approve', authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findOne({
    where: { id }
  });

  if (!payment) {
    return res.status(404).json({
      code: 'ERR_NOT_FOUND',
      message: 'Payment not found'
    });
  }

  if (payment.status === 'cancelled') {
    return res.status(404).json({
      code: 'ERR_CANNOT_APPROVE',
      message: 'Cannot approve a payment that has already been cancelled'
    });
  }

  await payment.update({
    status: 'approved'
  });

  res.status(200).json({
    code: 'APPROVED',
    message: 'The payment has been approved'
  });
});

router.put('/:id/cancel', authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findOne({
    where: { id }
  });

  if (!payment) {
    return res.status(404).json({
      code: 'ERR_NOT_FOUND',
      message: 'Payment not found'
    });
  }

  if (payment.status === 'approved') {
    return res.status(404).json({
      code: 'ERR_CANNOT_CANCEL',
      message: 'Cannot cancel a payment that has already been approved'
    });
  }

  await payment.update({
    status: 'cancelled'
  });
  return res.status(200).json({
    code: 'CANCELLED',
    message: 'The payment has been cancelled'
  });
});

module.exports = router;
