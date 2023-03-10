import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function listBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function bookingRoom(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const { roomId } = req.body;

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.bookingRoomById(userId, Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const roomId = Number(req.body.roomId);

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.changeBookingRoomById(userId, roomId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "CannotBookingError" || error.name === "NotFoundError" ) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }    
  }
}

export async function listRoomBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const roomId = Number(req.params.roomId);

    const bookingList = await bookingService.getBookingsByRoomId(roomId);

    return res.status(httpStatus.OK).send(bookingList);
  } catch (error) {
    if(error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send([]);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
